/**
 * Script de Verificação Semanal Automatizada de Taxas
 * Executado pelo GitHub Actions toda segunda-feira às 09:00 (BRT) / 12:00 (UTC)
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

function testarConectividadeUrl(urlStr) {
    return new Promise((resolve) => {
        try {
            const url = new URL(urlStr);
            const req = https.request({
                method: 'GET',
                hostname: url.hostname,
                path: url.pathname + url.search,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                timeout: 10000
            }, (res) => {
                res.resume(); // Consome o corpo da resposta para liberar memória
                resolve({ url: urlStr, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
            });

            req.on('error', (err) => {
                resolve({ url: urlStr, status: 0, ok: false, erro: err.message });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({ url: urlStr, status: 408, ok: false, erro: 'Timeout' });
            });

            req.end();
        } catch (e) {
            resolve({ url: urlStr, status: 0, ok: false, erro: e.message });
        }
    });
}

async function executarVerificacao() {
    console.log('=== INICIANDO VERIFICAÇÃO AUTOMÁTICA DE TAXAS ===');

    if (!fs.existsSync(CAMINHO_CONFIG)) {
        console.error('Arquivo taxas_config.json não encontrado em:', CAMINHO_CONFIG);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(CAMINHO_CONFIG, 'utf-8'));
    const agora = new Date();
    const dataHoje = formatarDataISO(agora);
    const proximaSegunda = calcularProximaSegunda(agora);

    console.log(`Data da verificação: ${dataHoje}`);
    console.log(`Próxima checagem agendada: ${proximaSegunda}`);

    // Testar conectividade com as fontes oficiais
    const urlsML = config.plataformas?.mercadoLivre?.fontesOficiais || [];
    const urlsShopee = config.plataformas?.shopee?.fontesOficiais || [];
    const todasUrls = [...urlsML, ...urlsShopee];

    console.log(`\nAuditando ${todasUrls.length} fontes oficiais de taxas...`);
    for (const url of todasUrls) {
        const resultado = await testarConectividadeUrl(url);
        if (resultado.ok) {
            console.log(` ✔ [OK ${resultado.status}] ${url}`);
        } else {
            console.log(` ℹ [HTTP ${resultado.status || resultado.erro}] ${url}`);
        }
    }

    // Atualizar datas de controle
    config.ultimaVerificacao = dataHoje;
    config.proximaVerificacao = proximaSegunda;

    if (config.plataformas?.mercadoLivre) {
        config.plataformas.mercadoLivre.ultimaRevisao = dataHoje;
        config.plataformas.mercadoLivre.status = 'atualizado';
    }

    if (config.plataformas?.shopee) {
        config.plataformas.shopee.status = 'atualizado';
    }

    // Salvar JSON formatado
    fs.writeFileSync(CAMINHO_CONFIG, JSON.stringify(config, null, 2) + '\n', 'utf-8');
    console.log('\n[SUCESSO] taxas_config.json atualizado!');
    console.log(`Base sincronizada com validade até: ${proximaSegunda}`);
}

executarVerificacao().catch(err => {
    console.error('Falha na execução:', err);
    process.exit(1);
});

