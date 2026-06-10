/* ==========================================================================
   1. ESTADO GLOBAL DA APLICAÇÃO (MEMÓRIA DO SISTEMA)
   ========================================================================== */
const estadoSistema = {
    saldoDisponivel: 0,
    carbonoRetidoTotal: 0,
    climaAtual: 'ideal',
    medalhas: {
        solo: false,
        carbono: false,
        investidor: false
    }
};

// Garante sincronização de tela e saldo na inicialização do documento
document.addEventListener('DOMContentLoaded', () => {
    atualizarExibicaoSaldo();
});

function atualizarExibicaoSaldo() {
    const elementoSaldo = document.querySelector('#saldo-exibicao');
    if (elementoSaldo) {
        elementoSaldo.innerText = `R$ ${estadoSistema.saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}

/* ==========================================================================
   2. CONTROLE DA TELA DE BLOQUEIO E DO MENU DE ABAS
   ========================================================================== */
// Tela de Bloqueio
const btnDesbloquear = document.querySelector('#btn-desbloquear');
const telaBloqueio = document.querySelector('#tela-bloqueio');

btnDesbloquear.addEventListener('click', () => {
    // CORRIGIDO: Usa a classe do utilitário CSS correto para ocultar a tela
    telaBloqueio.classList.add('esconder-elemento');
});

// Sistema de Abas (Navegação Interativa)
const botoesAbas = document.querySelectorAll('.aba-link');
const conteudosAbas = document.querySelectorAll('.aba-conteudo');

botoesAbas.forEach(botao => {
    botao.addEventListener('click', () => {
        // Remove a classe ativa de todos os botões e seções de conteúdo
        botoesAbas.forEach(b => b.classList.remove('ativa'));
        conteudosAbas.forEach(c => c.classList.remove('ativa'));

        // Ativa o botão clicado
        botao.classList.add('ativa');
        
        // Ativa o conteúdo correspondente baseado no atributo 'data-aba'
        const idAbaAlvo = botao.getAttribute('data-aba');
        document.querySelector(`#${idAbaAlvo}`).classList.add('ativa');
    });
});

/* ==========================================================================
   3. CONFIGURAÇÕES DOS ELEMENTOS GLOBAIS DE ERRO
   ========================================================================== */
const painelErro = document.querySelector('#painel-erro');

function exibirErroGlobal(mensagem) {
    painelErro.innerHTML = `<div class="caixa-erro">${mensagem}</div>`;
    // Rola a página para o topo de forma suave para garantir que o usuário veja a notificação
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparErroGlobal() {
    painelErro.innerHTML = '';
}

/* ==========================================================================
   4. LÓGICA DA ABA 1: SIMULADOR DE CARBONO & CERTIFICADO
   ========================================================================== */
const formCarbono = document.querySelector('#formulario-carbono');
const inputArea = document.querySelector('#tamanho-area');
const selectManejo = document.querySelector('#tipo-manejo');
const painelDadosCarbono = document.querySelector('#painel-dados-carbono');
const secaoCertificado = document.querySelector('#secao-certificado');
const certificadoDadosDinamicos = document.querySelector('#certificado-dados-dinamicos');

formCarbono.addEventListener('submit', (e) => {
    e.preventDefault();
    limparErroGlobal();

    const areaTexto = inputArea.value.trim();
    const areaNum = parseFloat(areaTexto);
    const manejo = selectManejo.value;

    /* --- VALIDAÇÃO ESTRITA --- */
    if (areaTexto === '' || manejo === '') {
        exibirErroGlobal('Erro Aba 1: Preencha todos os campos para calcular o carbono.');
        return;
    }
    if (isNaN(areaNum) || areaNum <= 0) {
        exibirErroGlobal('Erro Aba 1: O tamanho da área deve ser um número maior que zero.');
        return;
    }

    // Definição de fatores de retenção de CO2 por hectare
    let FatorRetencao = 1.1;
    let nomeManejo = 'Cultivo Tradicional';
    
    if (manejo === 'direto') { 
        FatorRetencao = 2.5; 
        nomeManejo = 'Plantio Direto'; 
    }
    if (manejo === 'ilpf') { 
        FatorRetencao = 4.2; 
        nomeManejo = 'Integração Lavoura-Pecuária-Floresta (ILPF)'; 
        // Gatilho da Conquista: Protetor do Solo
        desbloquearMedalha('solo');
    }

    // Modelagem Matemática dos Ativos Verdes
    const totalCO2 = areaNum * FatorRetencao;
    const precoCredito = 75.00;
    const ganhoFinanceiro = totalCO2 * precoCredito;

    // Atualização do Estado de Memória da Aplicação
    estadoSistema.carbonoRetidoTotal = totalCO2;
    estadoSistema.saldoDisponivel += ganhoFinanceiro;
    atualizarExibicaoSaldo();

    // Verificação de meta para a conquista Carbono Zero
    if (totalCO2 >= 100) {
        desbloquearMedalha('carbono');
    }

    // Injeção de Resultados Dinâmicos na Interface
    painelDadosCarbono.innerHTML = `
        <div class="resultado-bloco">
            <h4>Balanço da Propriedade</h4>
            <p>Área: <strong>${areaNum.toLocaleString('pt-BR')} ha</strong> | Manejo: <strong>${nomeManejo}</strong></p>
        </div>
        <div class="resultado-bloco">
            <h4>Retenção de CO₂ Estimada</h4>
            <p class="resultado-valor">${totalCO2.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} t / ano</p>
        </div>
        <div class="resultado-bloco">
            <h4>Ativos Convertidos (Créditos Gerados)</h4>
            <p class="resultado-valor">R$ ${ganhoFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Este valor foi adicionado ao seu Saldo de Compras na Aba de Insumos!</p>
        </div>
    `;

    // Ativação e Renderização do Bloco do Certificado Oficial
    secaoCertificado.classList.remove('esconder-elemento');
    certificadoDadosDinamicos.innerHTML = `
        <p><strong>Propriedade Analisada:</strong> ${areaNum.toLocaleString('pt-BR')} Hectares</p>
        <p><strong>Manejo de Sustentabilidade:</strong> ${nomeManejo}</p>
        <p><strong>Volume Certificado de Retenção:</strong> ${totalCO2.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} Toneladas de CO₂/ano</p>
    `;
});

// Manipulação do Evento nativo de Impressão (Layout via Media Queries CSS)
document.querySelector('#btn-imprimir-certificado').addEventListener('click', () => {
    window.print();
});

/* ==========================================================================
   5. LÓGICA DA ABA 2: LOJA DE INSUMOS & GRÁFICO DINÂMICO
   ========================================================================== */
const formCompra = document.querySelector('#formulario-compra');
const selectProduto = document.querySelector('#selecao-produto');
const painelDadosCompra = document.querySelector('#painel-dados-compra');

formCompra.addEventListener('submit', (e) => {
    e.preventDefault();
    limparErroGlobal();

    const opcaoSelecionada = selectProduto.options[selectProduto.selectedIndex];
    if (!opcaoSelecionada.value) {
        exibirErroGlobal('Erro Aba 2: Selecione um insumo para simular o teste.');
        return;
    }

    const custoProduto = parseFloat(opcaoSelecionada.getAttribute('data-preco'));
    const nomeProduto = opcaoSelecionada.text;

    /* --- VALIDAÇÃO DE SALDO ESTRITA --- */
    if (estadoSistema.saldoDisponivel < custoProduto) {
        exibirErroGlobal(`Saldo Insuficiente! O produto custa R$ ${custoProduto.toLocaleString('pt-BR')} e você tem apenas R$ ${estadoSistema.saldoDisponivel.toLocaleString('pt-BR')}. Vá para a Aba 1 e gere mais créditos de carbono simulando uma área maior.`);
        return;
    }

    // Processamento do Débito Financeiro Fictício
    estadoSistema.saldoDisponivel -= custoProduto;
    atualizarExibicaoSaldo();
    
    // Gatilho da Conquista: Investidor Verde
    desbloquearMedalha('investidor');

    // Algoritmo de Impacto Tecnológico baseado no Clima Vigente
    let incrementoProdutividade = 15; // Percentual base
    let notaEcologica = "Excelente redução de químicos nocivos.";

    if (opcaoSelecionada.value === 'sensor' && estadoSistema.climaAtual === 'seca') {
        incrementoProdutividade = 45; // Sensores IoT mitigam os efeitos severos da estiagem
        notaEcologica = "Gestão hídrica automatizada inteligente evitou o colapso por seca severa.";
    } else if (opcaoSelecionada.value === 'biofertilizante') {
        incrementoProdutividade = 25;
        notaEcologica = "Recuperação microbiológica ativa do solo sem aditivos minerais pesados.";
    }

    painelDadosCompra.innerHTML = `
        <div class="resultado-bloco" style="background-color: #eff6ff; border-left-color: #3b82f6;">
            <h4>Simulação de Compra Efetuada</h4>
            <p>Item: <strong>${nomeProduto}</strong> adquirido com fundos verdes do ecossistema.</p>
        </div>
        <div class="resultado-bloco">
            <h4>Resultado do Teste em Campo</h4>
            <p class="resultado-valor">+ ${incrementoProdutividade}% de Produtividade</p>
            <p>Impacto Ecológico: ${notaEcologica}</p>
        </div>
    `;
});

/* ==========================================================================
   6. LÓGICA DA ABA 3: SIMULADOR DE CLIMA E ATUALIZAÇÃO DO GRÁFICO
   ========================================================================== */
const formClima = document.querySelector('#formulario-clima');
const selectClima = document.querySelector('#cenario-clima');
const painelDadosClima = document.querySelector('#painel-dados-clima');

// Elementos de Controle Gráfico (Barras Voláteis)
const barraTomate = document.querySelector('#barra-tomate');
const barraPepino = document.querySelector('#barra-pepino');
const valorTomate = document.querySelector('#valor-tomate');
const valorPepino = document.querySelector('#valor-pepino');

formClima.addEventListener('submit', (e) => {
    e.preventDefault();
    limparErroGlobal();

    const clima = selectClima.value;
    if (clima === '') {
        exibirErroGlobal('Erro Aba 3: Selecione um cenário climático para testar.');
        return;
    }

    // Grava a situação climática no estado global
    estadoSistema.climaAtual = clima;

    let mensagemAlerta = '';
    let classeAlerta = '';
    
    // Definição das variáveis de mercado padrão
    let precoTomateNum = 3000;
    let precoPepinoNum = 4800;
    let larguraTomate = "50%";
    let larguraPepino = "80%";

    if (clima === 'ideal') {
        mensagemAlerta = '🌦️ Cenário Ideal: Clima estável. Condições ótimas para o plantio imediato tanto do Tomate quanto do Pepino. Baixo risco de perdas aeróbicas.';
        classeAlerta = 'sucesso';
        precoTomateNum = 2800; larguraTomate = "45%";
        precoPepinoNum = 3900; larguraPepino = "65%";
    } else if (clima === 'seca') {
        mensagemAlerta = '🚨 Alerta de Seca Severa: Alta evapotranspiração do solo. Momento CRÍTICO. Não plante Tomate sem irrigação controlada por Sensores IoT. O Pepino resiste um pouco melhor, mas o preço disparou no mercado devido à escassez global!';
        classeAlerta = 'perigo';
        precoTomateNum = 5100; larguraTomate = "75%";
        precoPepinoNum = 6800; larguraPepino = "100%"; // O Pepino atinge valor teto no mercado
    } else if (clima === 'geada') {
        mensagemAlerta = '⚠️ Alerta de Frente Fria: Risco iminente de geada em folhas jovens. Recomenda-se retardar o plantio do Tomate ou aplicar coberturas vegetais protetoras (Sementes de Alta Performance mitigam o dano).';
        classeAlerta = 'aviso';
        precoTomateNum = 4200; larguraTomate = "65%";
        precoPepinoNum = 5000; larguraPepino = "82%";
    }

    // Injeção da Caixa de Alerta Contextualizada
    painelDadosClima.innerHTML = `
        <div class="alerta-clima-box ${classeAlerta}">
            ${mensagemAlerta}
        </div>
    `;

    // Atualização em Tempo Real das Dimensões e Valores das Barras do Gráfico
    barraTomate.style.width = larguraTomate;
    barraPepino.style.width = larguraPepino;
    valorTomate.innerText = `R$ ${precoTomateNum.toLocaleString('pt-BR')} / t`;
    valorPepino.innerText = `R$ ${precoPepinoNum.toLocaleString('pt-BR')} / t ${clima === 'seca' ? '▲▲' : '▲'}`;
});

/* ==========================================================================
   7. LÓGICA DA ABA 4: CHAT DA IA COM CONHECIMENTO INTEGRADO (LÓGICA PURA)
   ========================================================================== */
const formChat = document.querySelector('#formulario-chat');
const inputChat = document.querySelector('#chat-mensagem-usuario');
const chatHistorico = document.querySelector('#chat-historico');

formChat.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pergunta = inputChat.value.trim().toLowerCase();
    if (pergunta === '') return;

    // Renderiza a fala do usuário no container histórico
    chatHistorico.innerHTML += `<p class="chat-msg usuario">${inputChat.value}</p>`;
    inputChat.value = ''; // Reseta o campo de texto

    let respostaBot = 'Análise do Assistente AgroViva: Palavra-chave não mapeada no banco de dados. Tente usar termos centrais como: "solo", "carbono", "clima", "tomate" ou "pepino".';

    // Banco de Dados Semântico Localizado
    if (pergunta.includes('solo') || pergunta.includes('manejo') || pergunta.includes('ilpf')) {
        respostaBot = 'Diagnóstico de Solo: Para fixar nutrientes de forma sustentável e evitar erosões, use a Integração Lavoura-Pecuária-Floresta (ILPF) ou Plantio Direto. Isso aumenta seu fator de retenção orgânica para até 4.2 t/ha de carbono ao ano!';
    } else if (pergunta.includes('carbono') || pergunta.includes('crédito') || pergunta.includes('credito')) {
        respostaBot = 'Mercado de Carbono: Cada tonelada de CO₂ evitada equivale a 1 Crédito de Carbono, avaliado em R$ 75,00 no AgroViva. Preservar o meio ambiente gera ativos financeiros reais reutilizáveis no nosso simulador de insumos.';
    } else if (pergunta.includes('clima') || pergunta.includes('seca') || pergunta.includes('geada')) {
        respostaBot = 'Inteligência Climática: Mudanças extremas geram escassez e elevam o valor das hortaliças. Sob Seca Severa, a melhor decisão estratégica é investir nos Sensores IoT na Loja para otimizar e salvar a umidade da terra.';
    } else if (pergunta.includes('tomate')) {
        respostaBot = 'Cultura - Tomate: É extremamente sensível ao estresse hídrico e à geada. Em climas desfavoráveis, seu valor sobe devido às perdas de campo. Exige alto monitoramento e biofertilização.';
    } else if (pergunta.includes('pepino')) {
        respostaBot = 'Cultura - Pepino: Apresenta excelente resposta mercadológica ativa no ecossistema AgroViva. Em cenários de estiagem, seu valor bate recordes históricos (R$ 6.800/t), sendo uma ótima alternativa de alta rentabilidade.';
    }

    // UX: Simula um pequeno atraso de processamento da IA
    setTimeout(() => {
        chatHistorico.innerHTML += `<p class="chat-msg bot">${respostaBot}</p>`;
        // Executa a rolagem automática para manter o chat sempre na última mensagem
        chatHistorico.scrollTop = chatHistorico.scrollHeight;
    }, 400);
});

/* ==========================================================================
   8. SISTEMA DE AUXÍLIO DE CONQUISTAS (GAMIFICAÇÃO)
   ========================================================================== */
function desbloquearMedalha(chave) {
    if (estadoSistema.medalhas[chave] === false) {
        estadoSistema.medalhas[chave] = true;
        const cardMedalha = document.querySelector(`#medalha-${chave}`);
        if (cardMedalha) {
            // Atualiza visualmente o card alterando os filtros e cores do CSS
            cardMedalha.classList.remove('bloqueada');
            cardMedalha.classList.add('desbloqueada');
        }
    }
}
