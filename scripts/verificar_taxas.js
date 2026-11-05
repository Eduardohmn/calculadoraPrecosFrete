/**
 * Script de Verificação Semanal Automatizada de Taxas
 * Lê o conteúdo das páginas oficiais, compara as tarifas configuradas em taxas_config.json
 * e só marca uma plataforma como "atualizado" (e avança ultimaRevisao) quando os valores
 * são efetivamente encontrados e validados no conteúdo oficial.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CAMINHO_CONFIG = path.join(__dirname, '..', 'taxas_config.json');

function formatarDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function calcularProximaSegunda(dataBase = new Date()) {
    const d = new Date(dataBase);
    const diaSemana = d.getDay(); // 0 = Domingo, 1 = Segunda, ...
    let diasAteSegunda = (1 + 7 - diaSemana) % 7;
    if (diasAteSegunda === 0) {
        diasAteSegunda = 7;
    }
    d.setDate(d.getDate() + diasAteSegunda);
    return formatarDataISO(d);
}

function formatarMoedaBRSemSimbolo(valor) {
    return Number(valor).toFixed(2).replace('.', ',');
}

function buscarConteudoUrl(urlStr, redirecionamentos = 0) {
    return new Promise((resolve) => {
        if (redirecionamentos > 5) {
            return resolve({ url: urlStr, status: 0, ok: false, conteudo: '', erro: 'Excesso de redirecionamentos' });
        }

        try {
            const url = new URL(urlStr);
            const req = https.request({
                method: 'GET',
                hostname: url.hostname,
                path: url.pathname + url.search,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Accept-Encoding': 'identity'
                },
                timeout: 15000
            }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    res.resume();
                    const novaUrl = new URL(res.headers.location, urlStr).toString();
                    return resolve(buscarConteudoUrl(novaUrl, redirecionamentos + 1));
                }

                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => {
                    const conteudo = Buffer.concat(chunks).toString('utf-8');
                    const ok = res.statusCode >= 200 && res.statusCode < 300 && conteudo.length > 0;
                    resolve({ url: urlStr, status: res.statusCode, ok, conteudo });
                });
            });

            req.on('error', (err) => {
                resolve({ url: urlStr, status: 0, ok: false, conteudo: '', erro: err.message });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({ url: urlStr, status: 408, ok: false, conteudo: '', erro: 'Timeout' });
            });

            req.end();
        } catch (e) {
            resolve({ url: urlStr, status: 0, ok: false, conteudo: '', erro: e.message });
        }
    });
}

function normalizarTextoHtml(html) {
    if (!html) return '';
    return html
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function extrairLinhasTabelaML(html) {
    const linhas = [];
    const regexTr = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let matchTr;
    while ((matchTr = regexTr.exec(html)) !== null) {
        const trConteudo = matchTr[1];
        const regexValores = /R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})/g;
        const valoresLinha = [];
        let matchVal;
        while ((matchVal = regexValores.exec(trConteudo)) !== null) {
            const num = parseFloat(matchVal[1].replace(/\./g, '').replace(',', '.'));
            if (Number.isFinite(num)) {
                valoresLinha.push(num);
            }
        }
        if (valoresLinha.length === 8) {
            linhas.push(valoresLinha);
        }
    }
    return linhas;
}

function auditarMercadoLivre(mlConfig, respostas) {
    const falhasHttp = respostas.filter(r => !r.ok);
    if (respostas.length === 0 || falhasHttp.length > 0) {
        const detalhe = falhasHttp.map(f => `${f.url} -> ${f.status || f.erro}`).join('; ');
        return {
            atualizado: false,
            status: 'erro_acesso',
            detalheStatus: `Falha ao acessar fonte(s) oficial(is) do Mercado Livre: ${detalhe || 'Nenhuma URL configurada'}`
        };
    }

    const htmlCombinado = respostas.map(r => r.conteudo).join('\n');
    const textoNormalizado = normalizarTextoHtml(htmlCombinado);

    // 1. Tentar extrair as 30 linhas de 8 colunas diretamente da tabela HTML
    const linhasExtraidas = extrairLinhasTabelaML(htmlCombinado);
    const matrizEsperada = mlConfig.freteMatrix || [];

    if (linhasExtraidas.length >= 30 && matrizEsperada.length === 30) {
        const divergencias = [];
        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 8; j++) {
                const esperado = matrizEsperada[i][j];
                const encontrado = linhasExtraidas[i][j];
                if (Math.abs(esperado - encontrado) > 0.005) {
                    divergencias.push(`Faixa ${i + 1}, Col ${j + 1}: esperado R$ ${formatarMoedaBRSemSimbolo(esperado)}, encontrado R$ ${formatarMoedaBRSemSimbolo(encontrado)}`);
                }
            }
        }
        if (divergencias.length > 0) {
            return {
                atualizado: false,
                status: 'divergencia_detectada',
                detalheStatus: `Divergência na tabela do Mercado Livre (${divergencias.length} valores diferentes). Ex: ${divergencias[0]}`,
                divergencias
            };
        }
    }

    // 2. Verificar presença dos valores da matriz e parâmetros-chave no texto da página
    const valoresUnicosMatriz = Array.from(new Set(matrizEsperada.flat()));
    let valoresEncontrados = 0;
    const valoresAusentes = [];

    for (const val of valoresUnicosMatriz) {
        const strVal = formatarMoedaBRSemSimbolo(val);
        if (textoNormalizado.includes(strVal) || htmlCombinado.includes(strVal)) {
            valoresEncontrados++;
        } else {
            valoresAusentes.push(`R$ ${strVal}`);
        }
    }

    const freteGratisMin = mlConfig.parametrosChave?.freteGratisRapidoObrigatorio ?? 79;
    const limiteTeto = mlConfig.parametrosChave?.limitePrecoTeto ?? 19;
    const temRegra79 = textoNormalizado.includes(`R$ ${freteGratisMin}`) || textoNormalizado.includes(`R$${freteGratisMin}`);
    const temRegra19 = textoNormalizado.includes(`R$ ${limiteTeto}`) || textoNormalizado.includes(`R$${limiteTeto}`);

    // Se a página retornou HTML sem os dados da tabela (ex.: bloqueio anti-bot/challenge ou renderização client-side vazia)
    if (valoresEncontrados === 0 || (!temRegra79 && !temRegra19)) {
        return {
            atualizado: false,
            status: 'verificacao_incompleta',
            detalheStatus: 'Página respondeu HTTP 200, mas a tabela de tarifas não estava presente no HTML retornado (possível bloqueio anti-bot ou renderização dinâmica).'
        };
    }

    if (valoresAusentes.length > 0 || !temRegra79 || !temRegra19) {
        return {
            atualizado: false,
            status: 'divergencia_detectada',
            detalheStatus: `Possível alteração nas tarifas do Mercado Livre: ${valoresAusentes.length} valor(es) da matriz não encontrado(s) (${valoresAusentes.slice(0, 5).join(', ')}).`
        };
    }

    return {
        atualizado: true,
        status: 'atualizado',
        detalheStatus: `Todas as ${valoresUnicosMatriz.length} tarifas únicas e regras do Mercado Livre foram conferidas e validadas.`
    };
}

function auditarShopee(shopeeConfig, respostas) {
    const falhasHttp = respostas.filter(r => !r.ok);
    if (respostas.length === 0 || falhasHttp.length > 0) {
        const detalhe = falhasHttp.map(f => `${f.url} -> ${f.status || f.erro}`).join('; ');
        return {
            atualizado: false,
            status: 'erro_acesso',
            detalheStatus: `Falha ao acessar fonte(s) oficial(is) da Shopee: ${detalhe || 'Nenhuma URL configurada'}`
        };
    }

    const htmlCombinado = respostas.map(r => r.conteudo).join('\n');
    const textoNormalizado = normalizarTextoHtml(htmlCombinado);
    const conteudoBusca = `${textoNormalizado}\n${htmlCombinado}`;

    const params = shopeeConfig.parametrosChave || {};
    const faixas = shopeeConfig.faixasComissao || [];

    const marcadoresEsperados = [
        { nome: 'Taxa fixa base', valor: formatarMoedaBRSemSimbolo(params.taxaFixaBase ?? 4.50) },
        { nome: 'Adicional CPF (+R$ 3,00)', valor: formatarMoedaBRSemSimbolo(params.adicionalCpfMais450 ?? 3.00) },
        { nome: 'Limite 450 pedidos CPF', valor: '450' }
    ];

    for (const f of faixas) {
        if (f.pctComissao) {
            marcadoresEsperados.push({ nome: `Comissão ${f.pctComissao}%`, valor: `${f.pctComissao}%` });
        }
        if (f.taxaFixa) {
            marcadoresEsperados.push({ nome: `Taxa fixa R$ ${formatarMoedaBRSemSimbolo(f.taxaFixa)}`, valor: formatarMoedaBRSemSimbolo(f.taxaFixa) });
        }
    }

    const ausentes = [];
    let encontrados = 0;
    for (const m of marcadoresEsperados) {
        if (conteudoBusca.includes(m.valor)) {
            encontrados++;
        } else {
            ausentes.push(`${m.nome} (${m.valor})`);
        }
    }

    if (encontrados <= 1) {
        return {
            atualizado: false,
            status: 'verificacao_incompleta',
            detalheStatus: 'A página da Shopee carregou apenas o shell da aplicação (SPA) sem os valores das tarifas no HTML inicial; requer revisão manual.'
        };
    }

    if (ausentes.length > 0) {
        return {
            atualizado: false,
            status: 'divergencia_detectada',
            detalheStatus: `Parâmetros da Shopee não encontrados ou alterados na página oficial: ${ausentes.join(', ')}.`
        };
    }

    return {
        atualizado: true,
        status: 'atualizado',
        detalheStatus: 'Todas as faixas de comissão e taxas fixas da Shopee foram conferidas e validadas.'
    };
}

async function executarVerificacao() {
    console.log('=== INICIANDO AUDITORIA E COMPARAÇÃO DE TAXAS ===');

    if (!fs.existsSync(CAMINHO_CONFIG)) {
        console.error('Arquivo taxas_config.json não encontrado em:', CAMINHO_CONFIG);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(CAMINHO_CONFIG, 'utf-8'));
    const agora = new Date();
    const dataHoje = formatarDataISO(agora);
    const proximaSegunda = calcularProximaSegunda(agora);

    console.log(`Data da execução: ${dataHoje}`);
    console.log(`Próxima checagem agendada: ${proximaSegunda}`);

    // 1. Auditar Mercado Livre
    const mlConfig = config.plataformas?.mercadoLivre || {};
    const urlsML = mlConfig.fontesOficiais || [];
    console.log(`\n[Mercado Livre] Baixando e analisando ${urlsML.length} fonte(s)...`);
    const respostasML = [];
    for (const url of urlsML) {
        const res = await buscarConteudoUrl(url);
        respostasML.push(res);
        console.log(` - [${res.ok ? 'HTTP ' + res.status : 'FALHA ' + (res.status || res.erro)}] ${url} (${res.conteudo.length} bytes)`);
    }
    const resultadoML = auditarMercadoLivre(mlConfig, respostasML);
    console.log(` -> Status ML: ${resultadoML.status} | ${resultadoML.detalheStatus}`);

    // 2. Auditar Shopee
    const shopeeConfig = config.plataformas?.shopee || {};
    const urlsShopee = shopeeConfig.fontesOficiais || [];
    console.log(`\n[Shopee] Baixando e analisando ${urlsShopee.length} fonte(s)...`);
    const respostasShopee = [];
    for (const url of urlsShopee) {
        const res = await buscarConteudoUrl(url);
        respostasShopee.push(res);
        console.log(` - [${res.ok ? 'HTTP ' + res.status : 'FALHA ' + (res.status || res.erro)}] ${url} (${res.conteudo.length} bytes)`);
    }
    const resultadoShopee = auditarShopee(shopeeConfig, respostasShopee);
    console.log(` -> Status Shopee: ${resultadoShopee.status} | ${resultadoShopee.detalheStatus}`);

    // 3. Atualizar metadados com honestidade (só avança ultimaRevisao se os valores foram de fato validados)
    config.ultimaTentativaVerificacao = dataHoje;
    config.proximaVerificacao = proximaSegunda;

    if (config.plataformas?.mercadoLivre) {
        config.plataformas.mercadoLivre.status = resultadoML.status;
        config.plataformas.mercadoLivre.detalheStatus = resultadoML.detalheStatus;
        config.plataformas.mercadoLivre.ultimaTentativa = dataHoje;
        if (resultadoML.atualizado) {
            config.plataformas.mercadoLivre.ultimaRevisao = dataHoje;
        }
    }

    if (config.plataformas?.shopee) {
        config.plataformas.shopee.status = resultadoShopee.status;
        config.plataformas.shopee.detalheStatus = resultadoShopee.detalheStatus;
        config.plataformas.shopee.ultimaTentativa = dataHoje;
        if (resultadoShopee.atualizado) {
            config.plataformas.shopee.ultimaRevisao = dataHoje;
        }
    }

    const ambasAtualizadas = resultadoML.atualizado && resultadoShopee.atualizado;
    if (ambasAtualizadas) {
        config.ultimaVerificacao = dataHoje;
        config.statusGeral = 'atualizado';
    } else if (resultadoML.status === 'divergencia_detectada' || resultadoShopee.status === 'divergencia_detectada') {
        config.statusGeral = 'divergencia_detectada';
    } else {
        config.statusGeral = 'verificacao_parcial';
    }

    fs.writeFileSync(CAMINHO_CONFIG, JSON.stringify(config, null, 2) + '\n', 'utf-8');
    console.log('\n=== RESUMO DA AUDITORIA ===');
    console.log(`Status Geral: ${config.statusGeral}`);
    console.log(`Revisão confirmada ML: ${config.plataformas?.mercadoLivre?.ultimaRevisao} (${resultadoML.status})`);
    console.log(`Revisão confirmada Shopee: ${config.plataformas?.shopee?.ultimaRevisao} (${resultadoShopee.status})`);
}

executarVerificacao().catch(err => {
    console.error('Falha crítica na execução:', err);
    process.exit(1);
});
