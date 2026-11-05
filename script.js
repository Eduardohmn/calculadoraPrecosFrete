// ==================== TABELA DE FRETES MERCADO LIVRE ====================
let pesoLimitesML = [
    0.3, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0,
    8.0, 9.0, 10.0, 11.0, 13.0, 15.0, 17.0, 20.0, 25.0, 30.0,
    40.0, 50.0, 60.0, 70.0, 80.0, 90.0, 100.0, 125.0, 150.0, Infinity
];

let freteMatrixML = [
    // [0-18.99, 19-48.99, 49-78.99, 79-99.99, 100-119.99, 120-149.99, 150-199.99, 200+]
    [5.65, 6.85, 8.15, 12.95, 14.95, 16.95, 19.05, 21.65], // 1. Até 0,3 kg
    [5.95, 6.95, 8.25, 13.85, 16.15, 18.15, 20.45, 23.25], // 2. De 0,3 a 0,5 kg
    [6.05, 7.15, 8.45, 14.45, 16.85, 19.05, 21.35, 24.45], // 3. De 0,5 a 1 kg
    [6.15, 7.35, 8.65, 14.75, 17.15, 19.45, 21.75, 25.45], // 4. De 1 a 1,5 kg
    [6.25, 7.45, 8.75, 15.05, 17.65, 19.85, 22.25, 25.55], // 5. De 1,5 a 2 kg
    [6.35, 8.65, 9.15, 16.45, 19.15, 21.65, 24.35, 27.05], // 6. De 2 a 3 kg
    [6.45, 8.75, 9.75, 17.85, 20.75, 23.35, 26.35, 29.25], // 7. De 3 a 4 kg
    [6.55, 8.85, 10.25, 19.75, 22.85, 26.05, 29.25, 32.45], // 8. De 4 a 5 kg
    [6.65, 8.95, 10.35, 25.95, 29.15, 33.35, 36.45, 40.85], // 9. De 5 a 6 kg
    [6.75, 9.05, 10.45, 27.55, 31.65, 36.75, 40.85, 45.25], // 10. De 6 a 7 kg
    [6.85, 9.25, 10.55, 29.45, 34.35, 39.25, 44.15, 49.35], // 11. De 7 a 8 kg
    [6.95, 9.35, 10.65, 30.25, 35.25, 40.35, 45.35, 50.75], // 12. De 8 a 9 kg
    [7.05, 9.45, 10.85, 38.25, 45.05, 51.95, 58.75, 65.85], // 13. De 9 a 10 kg
    [7.05, 9.65, 11.05, 41.65, 48.55, 55.45, 62.35, 69.35], // 14. De 10 a 11 kg
    [7.15, 10.05, 11.45, 42.55, 49.75, 56.85, 63.85, 70.95], // 15. De 11 a 13 kg
    [7.25, 10.25, 11.65, 45.55, 52.95, 60.55, 68.15, 75.65], // 16. De 13 a 15 kg
    [7.35, 10.45, 11.85, 48.95, 56.55, 64.05, 71.35, 79.35], // 17. De 15 a 17 kg
    [7.45, 10.65, 12.05, 55.15, 64.35, 73.55, 82.75, 91.95], // 18. De 17 a 20 kg
    [7.65, 11.05, 12.25, 64.55, 75.75, 85.45, 96.25, 106.85], // 19. De 20 a 25 kg
    [7.75, 11.25, 12.45, 66.45, 76.05, 86.25, 97.15, 107.85], // 20. De 25 a 30 kg
    [7.85, 11.45, 12.65, 68.35, 79.65, 89.75, 100.05, 107.95], // 21. De 30 a 40 kg
    [7.95, 11.65, 12.85, 70.95, 81.85, 92.85, 103.45, 111.65], // 22. De 40 a 50 kg
    [8.05, 11.85, 13.05, 75.55, 87.25, 99.05, 110.25, 119.05], // 23. De 50 a 60 kg
    [8.15, 12.05, 13.25, 80.95, 93.75, 105.95, 118.05, 127.45], // 24. De 60 a 70 kg
    [8.25, 12.25, 13.45, 84.65, 97.95, 110.75, 123.35, 133.15], // 25. De 70 a 80 kg
    [8.35, 12.45, 13.65, 94.05, 108.35, 122.95, 136.95, 147.85], // 26. De 80 a 90 kg
    [8.45, 12.65, 13.85, 107.45, 124.85, 140.45, 156.45, 168.85], // 27. De 90 a 100 kg
    [8.55, 12.85, 14.05, 120.15, 138.95, 156.95, 174.85, 188.85], // 28. De 100 a 125 kg
    [8.65, 12.85, 14.25, 127.45, 147.05, 166.55, 185.55, 200.35], // 29. De 125 a 150 kg
    [8.75, 12.85, 14.45, 167.05, 193.35, 218.45, 243.45, 262.85]  // 30. Mais de 150 kg
];

// Configurações padrão Shopee (sobrescrevíveis pelo cache do taxas_config.json)
let shopeeConfig = {
    taxaFixaBase: 4.50,
    limitePrecoTeto: 9.00,
    tetoAbaixo9: 0.50,
    adicionalCpfMais450: 3.00,
    limiteRegressivoCpf: 12.00,
    faixasComissao: [
        { limite: 80.00, pctComissao: 20, taxaFixa: 4.50, subsidioPixPct: 0 },
        { limite: 100.00, pctComissao: 14, taxaFixa: 16.00, subsidioPixPct: 5 },
        { limite: 200.00, pctComissao: 14, taxaFixa: 20.00, subsidioPixPct: 5 },
        { limite: 500.00, pctComissao: 14, taxaFixa: 26.00, subsidioPixPct: 5 },
        { limite: null, pctComissao: 14, taxaFixa: 26.00, subsidioPixPct: 8 }
    ]
};

// Formatar moeda BRL
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const STORAGE_KEY = 'calculadoraVendas.formulario';
const camposFormulario = Array.from(document.querySelectorAll('input, select'));
const camposComValoresPadrao = new Set(['comissao', 'impostos', 'margemAlvo']);

// Elementos de Controle
const tabML = document.getElementById('tabML');
const tabShopee = document.getElementById('tabShopee');
const painelML = document.getElementById('painelML');
const painelShopee = document.getElementById('painelShopee');
const cardPesoML = document.getElementById('cardPesoML');
const cardLucroPrincipal = document.getElementById('cardLucroPrincipal');
const btnAdivinharCusto = document.getElementById('btnAdivinharCusto');

// Inputs ML
const chkFreteRapido = document.getElementById('freteGratisRapido');
const labelFreteRapido = document.getElementById('labelFreteGratisRapido');
let freteRapidoOpcionalUsuario = false;

// Inputs Shopee
const shopeeTipoVendedor = document.getElementById('shopeeTipoVendedor');
const wrapShopeeCpfOpcoes = document.getElementById('wrapShopeeCpfOpcoes');
const shopeeCpfMais450 = document.getElementById('shopeeCpfMais450');
const shopeeBadgeComissao = document.getElementById('shopeeBadgeComissao');
const shopeeRegraNota = document.getElementById('shopeeRegraNota');
const shopeePix = document.getElementById('shopeePix');

// Estado da Plataforma Ativa ('ml' ou 'shopee')
let plataformaAtiva = 'ml';

// Alternar abas
function selecionarPlataforma(plat) {
    plataformaAtiva = plat;
    if (plat === 'ml') {
        tabML.classList.add('active');
        tabShopee.classList.remove('active');
        painelML.hidden = false;
        painelShopee.hidden = true;
        cardPesoML.hidden = false;
        cardLucroPrincipal.classList.remove('shopee-highlight');
        btnAdivinharCusto.classList.remove('shopee-btn');
        document.getElementById('resTituloPlataforma').textContent = 'Lucro Líquido (Mercado Livre)';
    } else {
        tabShopee.classList.add('active');
        tabML.classList.remove('active');
        painelShopee.hidden = false;
        painelML.hidden = true;
        cardPesoML.hidden = true;
        cardLucroPrincipal.classList.add('shopee-highlight');
        btnAdivinharCusto.classList.add('shopee-btn');
        document.getElementById('resTituloPlataforma').textContent = 'Lucro Líquido (Shopee)';
    }
    salvarFormulario();
    calcular();
}

tabML.addEventListener('click', () => selecionarPlataforma('ml'));
tabShopee.addEventListener('click', () => selecionarPlataforma('shopee'));

// Sincronizar UI de opções CPF na Shopee
function atualizarOpcoesShopeeUI() {
    const isCpf = shopeeTipoVendedor.value === 'cpf';
    wrapShopeeCpfOpcoes.hidden = !isCpf;
}
shopeeTipoVendedor.addEventListener('change', () => {
    atualizarOpcoesShopeeUI();
    calcular();
});

// Sincronizar estado visual do checkbox de frete rápido ML
function sincronizarFreteRapidoUI(preco) {
    if (!chkFreteRapido) return;
    if (preco >= 79) {
        chkFreteRapido.checked = true;
        chkFreteRapido.disabled = true;
        if (labelFreteRapido) {
            labelFreteRapido.textContent = 'Frete grátis rápido incluso (obrigatório a partir de R$ 79)';
        }
    } else {
        chkFreteRapido.disabled = false;
        chkFreteRapido.checked = freteRapidoOpcionalUsuario;
        if (labelFreteRapido) {
            labelFreteRapido.textContent = 'Oferecer frete grátis rápido (opcional < R$ 79)';
        }
    }
}

function isFreteGratisRapidoAtivo(preco) {
    if (preco >= 79) return true;
    return Boolean(freteRapidoOpcionalUsuario);
}

// ==================== CÁLCULO DE FRETE MERCADO LIVRE ====================
function calcularCustoEnvioML(preco, pesoFaturado, reputacao, freteGratisRapido = false) {
    if (preco <= 0) return { custo: 0, detalhe: '' };
    const pesoValido = Math.max(0, Number.isFinite(pesoFaturado) ? pesoFaturado : 0);

    let rowIndex = pesoLimitesML.findIndex(limite => pesoValido <= limite);
    if (rowIndex === -1) rowIndex = pesoLimitesML.length - 1;

    let colIndex = 0;
    const ofereceFreteGratis = preco >= 79 || freteGratisRapido;

    if (preco < 79 && freteGratisRapido) {
        colIndex = 3;
    } else {
        if (preco >= 200) colIndex = 7;
        else if (preco >= 150) colIndex = 6;
        else if (preco >= 120) colIndex = 5;
        else if (preco >= 100) colIndex = 4;
        else if (preco >= 79) colIndex = 3;
        else if (preco >= 49) colIndex = 2;
        else if (preco >= 19) colIndex = 1;
        else colIndex = 0;
    }

    let custoEnvio = freteMatrixML[rowIndex][colIndex];

    if (ofereceFreteGratis) {
        if (reputacao === 'amarela') {
            custoEnvio = (custoEnvio * 2) * 0.60;
        } else if (reputacao === 'vermelha') {
            custoEnvio = custoEnvio * 2;
        }
    }

    let detalhe = '';
    if (preco >= 79) {
        detalhe = 'Frete grátis rápido';
    } else if (freteGratisRapido) {
        detalhe = 'Frete grátis rápido (opcional)';
    } else {
        detalhe = 'Envio padrão';
    }

    if (preco < 19) {
        const teto = preco * 0.5;
        if (custoEnvio > teto) {
            custoEnvio = teto;
            detalhe = 'Limitado a 50% do preço';
        }
    }

    return { custo: custoEnvio, detalhe };
}

// ==================== CÁLCULO OFICIAL SHOPEE ====================
function calcularShopee(preco, custo, impostosPct, tipoVendedor, cpfMais450, vendaPix) {
    custo = Math.max(0, Number.isFinite(custo) ? custo : 0);
    impostosPct = Math.max(0, Number.isFinite(impostosPct) ? impostosPct : 0);

    if (preco <= 0) {
        return {
            comissao: 0,
            taxaFixa: 0,
            pctComissao: 0,
            faixaTexto: '-',
            envio: 0,
            detalheEnvio: 'Incluso no Programa Frete Grátis',
            impostos: 0,
            custoTotal: custo,
            lucro: -custo,
            margem: 0,
            precoNF: 0,
            notaRegra: ''
        };
    }

    // 1. Faixas de comissão oficial da Shopee (para CNPJ e CPF base)
    const faixas = Array.isArray(shopeeConfig.faixasComissao) && shopeeConfig.faixasComissao.length > 0
        ? shopeeConfig.faixasComissao
        : [
            { limite: 80.00, pctComissao: 20, taxaFixa: 4.50, subsidioPixPct: 0 },
            { limite: 100.00, pctComissao: 14, taxaFixa: 16.00, subsidioPixPct: 5 },
            { limite: 200.00, pctComissao: 14, taxaFixa: 20.00, subsidioPixPct: 5 },
            { limite: 500.00, pctComissao: 14, taxaFixa: 26.00, subsidioPixPct: 5 },
            { limite: null, pctComissao: 14, taxaFixa: 26.00, subsidioPixPct: 8 }
        ];

    const faixaEncontrada = faixas.find(f => f.limite === null || preco < f.limite) || faixas[faixas.length - 1];
    let pctComissao = faixaEncontrada.pctComissao;
    let taxaFixa = faixaEncontrada.taxaFixa;
    let subsidioPixPct = faixaEncontrada.subsidioPixPct;
    let notaRegra = '';

    const limiteTetoPreco = shopeeConfig.limitePrecoTeto ?? 9.00;
    const tetoPct = shopeeConfig.tetoAbaixo9 ?? 0.50;

    if (preco < limiteTetoPreco) {
        const tetoTaxa = preco * tetoPct;
        if (taxaFixa > tetoTaxa) {
            taxaFixa = tetoTaxa;
            notaRegra = 'Taxa fixa limitada a 50% do valor do produto';
        }
    }

    // 2. Regra adicional para Vendedor CPF com + de 450 pedidos (+ R$ 3,00)
    let adicionalCpf = 0;
    if (tipoVendedor === 'cpf' && cpfMais450) {
        adicionalCpf = shopeeConfig.adicionalCpfMais450 ?? 3.00;
        const limiteRegressivo = shopeeConfig.limiteRegressivoCpf ?? 12.00;
        if (preco < limiteRegressivo) {
            const limiteMax = preco * tetoPct;
            if (taxaFixa + adicionalCpf > limiteMax) {
                adicionalCpf = Math.max(0, limiteMax - taxaFixa);
                notaRegra = 'Taxa regressiva CPF limitada a 50% do preço';
            }
        }
        taxaFixa += adicionalCpf;
    }

    // Texto descritivo da comissão
    let faixaTexto = `${pctComissao}% + ${formatCurrency(taxaFixa)}`;
    if (adicionalCpf > 0) {
        faixaTexto += ' (+R$3 CPF)';
    }

    // 3. Mecânica do Subsídio Pix
    let precoNF = preco;
    let valorSubsidioPix = 0;
    if (vendaPix && subsidioPixPct > 0) {
        valorSubsidioPix = preco * (subsidioPixPct / 100);
        precoNF = preco - valorSubsidioPix;
    }

    // A comissão bruta e abatimento do subsídio Pix
    const valorComissaoBruta = preco * (pctComissao / 100) + taxaFixa;
    let valorComissaoCobrada = valorComissaoBruta;
    if (vendaPix && valorSubsidioPix > 0) {
        // Shopee abate o subsídio concedido ao comprador da comissão do vendedor
        valorComissaoCobrada = valorComissaoBruta - valorSubsidioPix;
    }

    // 4. Impostos (incidem sobre o valor da nota fiscal emitida)
    const valorImpostos = precoNF * (impostosPct / 100);

    // 5. Custo de Envio (Programa Frete Grátis já contemplado na taxa)
    const custoEnvio = 0;

    // 6. Lucro Líquido e Margem Real
    const receitaLiquida = precoNF - valorComissaoCobrada;
    const custoTotal = custo + valorImpostos;
    const lucro = receitaLiquida - custoTotal;
    const margem = preco > 0 ? (lucro / preco) * 100 : 0;

    return {
        comissao: valorComissaoCobrada,
        taxaFixa: taxaFixa,
        pctComissao: pctComissao,
        faixaTexto: faixaTexto,
        envio: custoEnvio,
        detalheEnvio: 'Incluso no Programa Frete Grátis',
        impostos: valorImpostos,
        custoTotal: custo + valorComissaoCobrada + valorImpostos,
        lucro: lucro,
        margem: margem,
        precoNF: precoNF,
        valorSubsidioPix: valorSubsidioPix,
        notaRegra: notaRegra
    };
}

// ==================== VALIDAÇÃO DE ENTRADAS NÃO-NEGATIVAS ====================
function sanitizarCampoNaoNegativo(campo) {
    if (!campo || campo.type !== 'number' || campo.id === 'margemAlvo') return;
    const raw = String(campo.value);
    if (!raw.trim()) return;
    const num = parseFloat(raw);
    if (raw.includes('-') || (Number.isFinite(num) && num < 0)) {
        campo.value = '0';
    }
}

function lerNumeroNaoNegativo(id, padrao = 0) {
    const el = document.getElementById(id);
    if (!el) return padrao;
    sanitizarCampoNaoNegativo(el);
    const val = parseFloat(el.value);
    if (!Number.isFinite(val)) return padrao;
    return Math.max(0, val);
}

// ==================== RESTAURAÇÃO LOCAL STORAGE ====================
try {
    const valoresSalvos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (valoresSalvos && typeof valoresSalvos === 'object') {
        if (valoresSalvos['impostos'] === '19' || valoresSalvos['impostos'] === 19) {
            valoresSalvos['impostos'] = '18.6';
        }
        if (Object.prototype.hasOwnProperty.call(valoresSalvos, 'freteGratisRapido')) {
            freteRapidoOpcionalUsuario = Boolean(valoresSalvos['freteGratisRapido']);
        }
        if (valoresSalvos['plataformaAtiva']) {
            plataformaAtiva = valoresSalvos['plataformaAtiva'];
        }
        camposFormulario.forEach(campo => {
            if (!Object.prototype.hasOwnProperty.call(valoresSalvos, campo.id)) return;
            if (camposComValoresPadrao.has(campo.id) && !String(valoresSalvos[campo.id]).trim() && campo.id !== 'margemAlvo') return;
            if (campo.id === 'freteGratisRapido') {
                campo.checked = freteRapidoOpcionalUsuario;
            } else if (campo.type === 'checkbox') {
                campo.checked = Boolean(valoresSalvos[campo.id]);
            } else if (campo.id === 'margemAlvo') {
                const margemSalva = parseFloat(valoresSalvos[campo.id]);
                campo.value = (Number.isFinite(margemSalva) && margemSalva >= 15) ? String(margemSalva) : '15';
            } else {
                campo.value = valoresSalvos[campo.id];
                sanitizarCampoNaoNegativo(campo);
            }
        });
    }
} catch {
}

const inputMargemAlvoInit = document.getElementById('margemAlvo');
if (inputMargemAlvoInit && (!inputMargemAlvoInit.value || parseFloat(inputMargemAlvoInit.value) < 15)) {
    inputMargemAlvoInit.value = '15';
}

atualizarOpcoesShopeeUI();

// ==================== CÁLCULO GERAL E ATUALIZAÇÃO DOM ====================
function calcular() {
    camposFormulario.forEach(sanitizarCampoNaoNegativo);

    const existeEntrada = camposFormulario.some(campo =>
        campo.type !== 'checkbox' &&
        !camposComValoresPadrao.has(campo.id) &&
        campo.value.trim() !== ''
    );

    if (!existeEntrada) {
        [
            'resLucro', 'resMargem', 'resPeso', 'resDetalhePeso',
            'resComissao', 'resEnvio', 'resDetalheEnvio', 'resImpostos',
            'compLucroML', 'compMargemML', 'compLucroShopee', 'compMargemShopee'
        ].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
        const elImpostosPct = document.getElementById('resImpostosPct');
        if (elImpostosPct) {
            const impostosPct = lerNumeroNaoNegativo('impostos', 18.6);
            elImpostosPct.textContent = `${impostosPct.toString().replace('.', ',')}%`;
        }
        return;
    }

    const preco = lerNumeroNaoNegativo('precoVenda', 0);
    const custo = lerNumeroNaoNegativo('precoCusto', 0);
    const comissaoPctML = lerNumeroNaoNegativo('comissao', 0);
    const impostosPct = lerNumeroNaoNegativo('impostos', 18.6);

    // Atualizar percentual de imposto visível
    const elImpostosPct = document.getElementById('resImpostosPct');
    if (elImpostosPct) {
        elImpostosPct.textContent = `${impostosPct.toString().replace('.', ',')}%`;
    }

    // 1. CÁLCULO MERCADO LIVRE
    sincronizarFreteRapidoUI(preco);
    const freteGratisRapidoML = isFreteGratisRapidoAtivo(preco);
    const comp = lerNumeroNaoNegativo('comp', 0);
    const larg = lerNumeroNaoNegativo('larg', 0);
    const alt = lerNumeroNaoNegativo('alt', 0);
    const pesoFisico = lerNumeroNaoNegativo('pesoFisico', 0);
    const reputacao = document.getElementById('reputacao').value;

    const pesoVolumetrico = (comp * larg * alt) / 6000;
    const pesoFaturado = Math.max(pesoFisico, pesoVolumetrico);

    const envioML = calcularCustoEnvioML(preco, pesoFaturado, reputacao, freteGratisRapidoML);
    const valorComissaoML = preco * (comissaoPctML / 100);
    const valorImpostosML = preco * (impostosPct / 100);
    const custoTotalML = custo + valorComissaoML + valorImpostosML + envioML.custo;
    const lucroML = preco - custoTotalML;
    const margemML = preco > 0 ? (lucroML / preco) * 100 : 0;

    // 2. CÁLCULO SHOPEE
    const tipoVendedorShopee = shopeeTipoVendedor.value;
    const cpfMais450 = shopeeCpfMais450.checked;
    const vendaPix = shopeePix.checked;
    const resShopee = calcularShopee(preco, custo, impostosPct, tipoVendedorShopee, cpfMais450, vendaPix);

    // Atualizar badge da Shopee no painel
    if (shopeeBadgeComissao) {
        shopeeBadgeComissao.textContent = resShopee.faixaTexto;
    }
    if (shopeeRegraNota) {
        shopeeRegraNota.textContent = resShopee.notaRegra ||
            '* Taxa fixa atualizada para R$ 4,50 (out/2026). Para itens < R$ 9,00 limitada a metade do preço.';
    }

    // 3. ATUALIZAR CARD COMPARATIVO MULTI-PLATAFORMA
    const elCompLucroML = document.getElementById('compLucroML');
    const elCompMargemML = document.getElementById('compMargemML');
    const elCompLucroShopee = document.getElementById('compLucroShopee');
    const elCompMargemShopee = document.getElementById('compMargemShopee');

    const margemAlvoEl = document.getElementById('margemAlvo');
    const margemDesejadaVal = parseFloat(margemAlvoEl ? margemAlvoEl.value : 15);
    const pisoMargem = Math.max(15, Number.isFinite(margemDesejadaVal) ? margemDesejadaVal : 15);

    if (elCompLucroML) {
        elCompLucroML.textContent = formatCurrency(lucroML);
        elCompLucroML.style.color = (lucroML >= 0 && margemML >= pisoMargem) ? 'var(--gold)' : 'var(--danger)';
    }
    if (elCompMargemML) {
        const mlAbaixo15 = margemML < pisoMargem || lucroML < 0;
        elCompMargemML.textContent = `${margemML.toFixed(1)}% Margem${mlAbaixo15 ? ' (Abaixo de 15%)' : ''}`;
        elCompMargemML.style.color = mlAbaixo15 ? 'var(--danger)' : '';
    }
    if (elCompLucroShopee) {
        elCompLucroShopee.textContent = formatCurrency(resShopee.lucro);
        elCompLucroShopee.style.color = (resShopee.lucro >= 0 && resShopee.margem >= pisoMargem) ? 'var(--shopee)' : 'var(--danger)';
    }
    if (elCompMargemShopee) {
        const shopeeAbaixo15 = resShopee.margem < pisoMargem || resShopee.lucro < 0;
        elCompMargemShopee.textContent = `${resShopee.margem.toFixed(1)}% Margem${shopeeAbaixo15 ? ' (Abaixo de 15%)' : ''}`;
        elCompMargemShopee.style.color = shopeeAbaixo15 ? 'var(--danger)' : '';
    }

    // 4. ATUALIZAR RESULTADOS DA PLATAFORMA ATIVA
    const lucroAtivo = plataformaAtiva === 'ml' ? lucroML : resShopee.lucro;
    const margemAtiva = plataformaAtiva === 'ml' ? margemML : resShopee.margem;
    const corTema = plataformaAtiva === 'ml' ? 'var(--gold)' : 'var(--shopee)';

    const resLucro = document.getElementById('resLucro');
    resLucro.textContent = formatCurrency(lucroAtivo);
    resLucro.style.color = lucroAtivo >= 0 ? corTema : 'var(--danger)';

    const resMargem = document.getElementById('resMargem');
    resMargem.className = 'margin-badge ' + (plataformaAtiva === 'shopee' ? 'shopee-badge' : '');

    if (lucroAtivo < 0) {
        resMargem.textContent = `${margemAtiva.toFixed(1)}% Margem (Prejuízo)`;
        resMargem.style.color = 'var(--danger)';
        resMargem.style.backgroundColor = 'rgba(255, 82, 82, 0.25)';
        resMargem.style.border = '1px solid var(--danger)';
    } else if (margemAtiva < pisoMargem) {
        resMargem.textContent = `⚠️ ${margemAtiva.toFixed(1)}% Margem (Abaixo do mínimo de 15%)`;
        resMargem.style.color = 'var(--danger)';
        resMargem.style.backgroundColor = 'rgba(255, 82, 82, 0.25)';
        resMargem.style.border = '1px solid var(--danger)';
    } else {
        resMargem.textContent = `${margemAtiva.toFixed(1)}% Margem`;
        resMargem.style.color = corTema;
        resMargem.style.backgroundColor = plataformaAtiva === 'shopee' ? 'rgba(238, 77, 45, 0.2)' : 'rgba(212, 175, 55, 0.2)';
        resMargem.style.border = 'none';
    }

    // Detalhes da plataforma ativa
    const resLabelComissao = document.getElementById('resLabelComissao');
    const resComissao = document.getElementById('resComissao');
    const resLabelEnvio = document.getElementById('resLabelEnvio');
    const resEnvio = document.getElementById('resEnvio');
    const resDetalheEnvio = document.getElementById('resDetalheEnvio');
    const resImpostos = document.getElementById('resImpostos');

    if (plataformaAtiva === 'ml') {
        resLabelComissao.textContent = `Comissão ML (${comissaoPctML}%):`;
        resComissao.textContent = `- ${formatCurrency(valorComissaoML)}`;
        resLabelEnvio.textContent = 'Custo de Envio (Fixo/Frete):';
        resEnvio.textContent = `- ${formatCurrency(envioML.custo)}`;
        resDetalheEnvio.textContent = envioML.detalhe;
        resImpostos.textContent = `- ${formatCurrency(valorImpostosML)}`;

        document.getElementById('resPeso').textContent = `${pesoFaturado.toFixed(2)} kg`;
        document.getElementById('resDetalhePeso').textContent = `Físico: ${pesoFisico.toFixed(2)}kg | Vol: ${pesoVolumetrico.toFixed(2)}kg`;
    } else {
        resLabelComissao.textContent = `Comissão Shopee (${resShopee.faixaTexto}):`;
        resComissao.textContent = `- ${formatCurrency(resShopee.comissao)}`;
        resLabelEnvio.textContent = 'Frete Shopee (PFG):';
        resEnvio.textContent = `R$ 0,00`;
        resEnvio.style.color = 'var(--text-muted)';
        resDetalheEnvio.textContent = resShopee.detalheEnvio;
        resImpostos.textContent = `- ${formatCurrency(resShopee.impostos)}`;
        if (vendaPix && resShopee.valorSubsidioPix > 0) {
            resDetalheEnvio.textContent += ` | Base NF com Pix: ${formatCurrency(resShopee.precoNF)}`;
        }
    }
}

// ==================== ADIVINHAR CUSTO MÁXIMO ====================
function calcularCustoMaximo() {
    camposFormulario.forEach(sanitizarCampoNaoNegativo);
    const preco = lerNumeroNaoNegativo('precoVenda', 0);
    const margemAlvoInput = document.getElementById('margemAlvo');
    let margemAlvoValor = parseFloat(margemAlvoInput.value);

    if (preco <= 0) {
        document.getElementById('resCustoMax').textContent = '';
        document.getElementById('resDetalheAlvo').textContent = 'Informe um preço de venda maior que zero.';
        return;
    }

    // Trava rígida: se for vazio, inválido ou menor que 15, auto-corrige para 15%
    if (!Number.isFinite(margemAlvoValor) || margemAlvoValor < 15) {
        margemAlvoValor = 15;
        margemAlvoInput.value = '15';
        atualizarBotaoAdivinharCusto();
    }

    const impostosPct = lerNumeroNaoNegativo('impostos', 18.6);
    const margemAlvoPct = Math.max(15, margemAlvoValor);
    const valorMargemAlvo = preco * (margemAlvoPct / 100);

    let custoMaximoPermitido = 0;

    if (plataformaAtiva === 'ml') {
        const comissaoPct = lerNumeroNaoNegativo('comissao', 0);
        const comp = lerNumeroNaoNegativo('comp', 0);
        const larg = lerNumeroNaoNegativo('larg', 0);
        const alt = lerNumeroNaoNegativo('alt', 0);
        const pesoFisico = lerNumeroNaoNegativo('pesoFisico', 0);
        const pesoVolumetrico = (comp * larg * alt) / 6000;
        const pesoFaturado = Math.max(pesoFisico, pesoVolumetrico);
        const reputacao = document.getElementById('reputacao').value;
        const freteGratisRapido = isFreteGratisRapidoAtivo(preco);
        const envioInfo = calcularCustoEnvioML(preco, pesoFaturado, reputacao, freteGratisRapido);
        const valorComissao = preco * (comissaoPct / 100);
        const valorImpostos = preco * (impostosPct / 100);

        custoMaximoPermitido = preco - valorComissao - valorImpostos - envioInfo.custo - valorMargemAlvo;
    } else {
        const tipoVendedorShopee = shopeeTipoVendedor.value;
        const cpfMais450 = shopeeCpfMais450.checked;
        const vendaPix = shopeePix.checked;
        const resShopee = calcularShopee(preco, 0, impostosPct, tipoVendedorShopee, cpfMais450, vendaPix);

        custoMaximoPermitido = preco - resShopee.comissao - resShopee.impostos - valorMargemAlvo;
    }

    const elCustoMax = document.getElementById('resCustoMax');
    elCustoMax.textContent = formatCurrency(custoMaximoPermitido);
    const corTema = plataformaAtiva === 'ml' ? 'var(--gold)' : 'var(--shopee)';
    elCustoMax.style.color = custoMaximoPermitido > 0 ? corTema : 'var(--danger)';
    document.getElementById('resDetalheAlvo').textContent =
        `Sobra máxima para pagar ao fornecedor visando ${margemAlvoPct}% de margem na ${plataformaAtiva === 'ml' ? 'Mercado Livre' : 'Shopee'}.`;
}

function limparResultadoCustoMaximo() {
    document.getElementById('resCustoMax').textContent = '';
    document.getElementById('resDetalheAlvo').textContent =
        'Informe o preço de venda e a margem alvo para adivinhar o custo.';
}

function atualizarBotaoAdivinharCusto() {
    const preco = lerNumeroNaoNegativo('precoVenda', 0);
    const margemAlvoInput = document.getElementById('margemAlvo');
    const margemAlvo = parseFloat(margemAlvoInput.value);
    const msgMargemAlvo = document.getElementById('msgMargemAlvo');

    const temPrecoValido = Number.isFinite(preco) && preco > 0;
    const campoPreenchido = margemAlvoInput.value.trim() !== '';
    const menorQue15 = campoPreenchido && Number.isFinite(margemAlvo) && margemAlvo < 15;

    if (msgMargemAlvo) {
        msgMargemAlvo.style.display = menorQue15 ? 'block' : 'none';
    }
    if (menorQue15) {
        margemAlvoInput.style.borderColor = '#ff5252';
        btnAdivinharCusto.disabled = true;
        btnAdivinharCusto.title = 'A margem alvo não pode ser menor que 15%';
    } else {
        margemAlvoInput.style.borderColor = '';
        btnAdivinharCusto.disabled = false;
        btnAdivinharCusto.title = '';
    }

    btnAdivinharCusto.hidden = !temPrecoValido;
}

const inputMargemAlvo = document.getElementById('margemAlvo');
const sanitizarMargemMinima = () => {
    let val = parseFloat(inputMargemAlvo.value);
    if (!Number.isFinite(val) || val < 15) {
        inputMargemAlvo.value = '15';
    }
    atualizarBotaoAdivinharCusto();
    salvarFormulario();
    calcular();
};

inputMargemAlvo.addEventListener('change', sanitizarMargemMinima);
inputMargemAlvo.addEventListener('blur', sanitizarMargemMinima);

btnAdivinharCusto.addEventListener('click', calcularCustoMaximo);

const travaTaxas = document.getElementById('travaTaxas');
const camposTaxas = ['comissao', 'impostos'].map(id => document.getElementById(id));
const atualizarTravaTaxas = () => {
    camposTaxas.forEach(campo => {
        campo.readOnly = travaTaxas.checked;
    });
};
travaTaxas.addEventListener('change', atualizarTravaTaxas);
atualizarTravaTaxas();

// ==================== SALVAMENTO AUTOMÁTICO ====================
function salvarFormulario() {
    const valores = { plataformaAtiva };
    camposFormulario.forEach(campo => {
        sanitizarCampoNaoNegativo(campo);
        if (campo.id === 'freteGratisRapido') {
            valores[campo.id] = freteRapidoOpcionalUsuario;
        } else {
            valores[campo.id] = campo.type === 'checkbox' ? campo.checked : campo.value;
        }
    });

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(valores));
    } catch {
    }
}

camposFormulario.forEach(campo => {
    if (campo.type === 'number') {
        campo.addEventListener('keydown', (e) => {
            if (e.key === '-' || e.key === '+') {
                e.preventDefault();
            }
        });
        campo.addEventListener('change', () => sanitizarCampoNaoNegativo(campo));
        campo.addEventListener('blur', () => sanitizarCampoNaoNegativo(campo));
    }

    const evento = campo.type === 'checkbox' || campo.tagName === 'SELECT' ? 'change' : 'input';
    campo.addEventListener(evento, () => {
        sanitizarCampoNaoNegativo(campo);
        if (campo.id === 'freteGratisRapido') {
            const precoAtual = lerNumeroNaoNegativo('precoVenda', 0);
            if (precoAtual < 79) {
                freteRapidoOpcionalUsuario = campo.checked;
            }
        }
        salvarFormulario();
        limparResultadoCustoMaximo();
        atualizarBotaoAdivinharCusto();
        calcular();
    });
});

// ==================== GERENCIADOR DE CACHE DE TAXAS ====================
const CACHE_CONFIG_KEY = 'calculadoraVendas.taxasCache';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

function formatarDataBR(dataIso) {
    if (!dataIso || typeof dataIso !== 'string') return '';
    const partes = dataIso.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataIso;
}

function aplicarConfiguracaoTaxas(config) {
    if (!config || typeof config !== 'object') return;

    const ml = config.plataformas?.mercadoLivre;
    const sh = config.plataformas?.shopee;

    // 1. Atualizar badges na UI com datas e status reais de cada plataforma
    const lblUltimaVerif = document.getElementById('lblUltimaVerif');
    const lblRevisaoML = document.getElementById('lblRevisaoML');
    const lblRevisaoShopee = document.getElementById('lblRevisaoShopee');
    const lblProximaVerif = document.getElementById('lblProximaVerif');
    const syncDot = document.getElementById('syncDot');
    const syncBadge = document.getElementById('syncStatusBadge');

    if (lblUltimaVerif && config.ultimaVerificacao) {
        lblUltimaVerif.textContent = formatarDataBR(config.ultimaVerificacao);
    }
    if (lblRevisaoML && ml?.ultimaRevisao) {
        lblRevisaoML.textContent = formatarDataBR(ml.ultimaRevisao);
    }
    if (lblRevisaoShopee && sh?.ultimaRevisao) {
        lblRevisaoShopee.textContent = formatarDataBR(sh.ultimaRevisao);
    }
    if (lblProximaVerif && config.proximaVerificacao) {
        lblProximaVerif.textContent = formatarDataBR(config.proximaVerificacao);
    }

    const statusML = ml?.status || 'desconhecido';
    const statusShopee = sh?.status || 'desconhecido';
    const tudoAtualizado = (statusML === 'atualizado' || statusML === 'verificado') &&
                           (statusShopee === 'atualizado' || statusShopee === 'verificado');
    const temDivergencia = statusML === 'divergencia_detectada' || statusShopee === 'divergencia_detectada';

    if (syncDot) {
        syncDot.classList.remove('warning', 'error');
        if (temDivergencia) {
            syncDot.classList.add('error');
        } else if (!tudoAtualizado) {
            syncDot.classList.add('warning');
        }
    }

    if (syncBadge) {
        const msgML = ml?.detalheStatus ? `ML: ${ml.detalheStatus}` : `ML: ${statusML}`;
        const msgShopee = sh?.detalheStatus ? `Shopee: ${sh.detalheStatus}` : `Shopee: ${statusShopee}`;
        syncBadge.title = `${msgML} | ${msgShopee}`;
    }

    // 2. Atualizar Mercado Livre se disponível
    if (ml) {
        if (Array.isArray(ml.freteMatrix) && ml.freteMatrix.length === 30) {
            freteMatrixML = ml.freteMatrix;
        }
        if (Array.isArray(ml.pesoLimites) && ml.pesoLimites.length === 30) {
            pesoLimitesML = ml.pesoLimites.map(p => (p === null || p === undefined) ? Infinity : p);
        }
    }

    // 3. Atualizar Shopee se disponível
    if (sh) {
        if (sh.parametrosChave) {
            shopeeConfig.taxaFixaBase = sh.parametrosChave.taxaFixaBase ?? shopeeConfig.taxaFixaBase;
            shopeeConfig.limitePrecoTeto = sh.parametrosChave.limitePrecoTeto ?? shopeeConfig.limitePrecoTeto;
            shopeeConfig.tetoAbaixo9 = sh.parametrosChave.tetoAbaixo9 ?? shopeeConfig.tetoAbaixo9;
            shopeeConfig.adicionalCpfMais450 = sh.parametrosChave.adicionalCpfMais450 ?? shopeeConfig.adicionalCpfMais450;
            shopeeConfig.limiteRegressivoCpf = sh.parametrosChave.limiteRegressivoCpf ?? shopeeConfig.limiteRegressivoCpf;
        }
        if (Array.isArray(sh.faixasComissao) && sh.faixasComissao.length > 0) {
            shopeeConfig.faixasComissao = sh.faixasComissao;
        }
    }

    calcular();
}

async function inicializarTaxasComCache() {
    let temCacheValido = false;
    try {
        const cacheRaw = localStorage.getItem(CACHE_CONFIG_KEY);
        if (cacheRaw) {
            const cache = JSON.parse(cacheRaw);
            const agora = Date.now();
            // Cache válido se salvo há menos de 7 dias
            if (cache && cache.timestamp && (agora - cache.timestamp < CACHE_TTL_MS) && cache.data) {
                aplicarConfiguracaoTaxas(cache.data);
                temCacheValido = true;
            }
        }
    } catch (e) {
        console.warn('Cache local inacessível:', e);
    }

    // Se for o primeiro acesso ou se o cache expirou (passou de 7 dias)
    if (!temCacheValido) {
        try {
            const resposta = await fetch('./taxas_config.json?v=' + Date.now());
            if (resposta.ok) {
                const configNova = await resposta.json();
                localStorage.setItem(CACHE_CONFIG_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: configNova
                }));
                aplicarConfiguracaoTaxas(configNova);
            }
        } catch (erro) {
            console.info('Operando com taxas padrão offline/locais:', erro.message);
        }
    }
}

// Inicialização
selecionarPlataforma(plataformaAtiva);
const precoInicial = parseFloat(document.getElementById('precoVenda').value) || 0;
sincronizarFreteRapidoUI(precoInicial);
atualizarBotaoAdivinharCusto();
inicializarTaxasComCache();

if (camposFormulario.some(campo =>
    campo.type !== 'checkbox' &&
    !camposComValoresPadrao.has(campo.id) &&
    campo.value.trim() !== ''
)) {
    calcular();
}
