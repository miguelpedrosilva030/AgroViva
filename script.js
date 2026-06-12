/* ==================================================
   AGROVIVA - SCRIPT.JS
   ================================================== */

/* =========================
   ESTADO GLOBAL
========================= */

const estado = {
    saldo: 0,
    carbono: 0,
    clima: "Ideal",
    pontos: 0
};

/* =========================
   FUNÇÃO ADICIONAR PONTOS
   (usada também pelo minigame)
========================= */

function adicionarPontos(qtd) {
    estado.pontos += qtd;
    atualizarDashboard();

    // Atualiza ranking local com pontuação do jogador
    const idx = ranking.findIndex(j => j.nome === "Você");
    if (idx >= 0) {
        ranking[idx].pontos = estado.pontos;
    } else {
        ranking.push({ nome: "Você", pontos: estado.pontos });
    }
    ranking.sort((a, b) => b.pontos - a.pontos);
    atualizarRanking();
}

/* =========================
   TELA DE ENTRADA
========================= */

const telaEntrada = document.querySelector("#tela-entrada");
const btnEntrar   = document.querySelector("#btn-entrar");

if (btnEntrar) {
    btnEntrar.addEventListener("click", () => {
        telaEntrada.style.opacity = "0";
        setTimeout(() => {
            telaEntrada.style.display = "none";
        }, 500);
    });
}

/* =========================
   DASHBOARD
========================= */

const saldoDashboard   = document.querySelector("#saldo");
const carbonoDashboard = document.querySelector("#carbono");
const climaDashboard   = document.querySelector("#clima-atual");
const pontosDashboard  = document.querySelector("#pontos");

function atualizarDashboard() {
    if (saldoDashboard) {
        saldoDashboard.innerText =
            `R$ ${estado.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    if (carbonoDashboard) {
        carbonoDashboard.innerText = `${estado.carbono.toFixed(2)} t`;
    }
    if (climaDashboard) {
        climaDashboard.innerText = estado.clima;
    }
    if (pontosDashboard) {
        pontosDashboard.innerText = estado.pontos;
    }
}

atualizarDashboard();

/* =========================
   SISTEMA DE ABAS
========================= */

const abas      = document.querySelectorAll(".aba");
const conteudos = document.querySelectorAll(".conteudo");

abas.forEach(botao => {
    botao.addEventListener("click", () => {
        abas.forEach(a => a.classList.remove("ativa"));
        conteudos.forEach(c => c.classList.remove("ativa"));
        botao.classList.add("ativa");
        const alvo = document.querySelector("#" + botao.dataset.aba);
        if (alvo) alvo.classList.add("ativa");
    });
});

/* =========================
   CALCULADORA FINANCEIRA
========================= */

const btnCalcular        = document.querySelector("#btn-calcular");
const inputCustos        = document.querySelector("#custos");
const inputVendas        = document.querySelector("#vendas");
const resultadoFinanceiro = document.querySelector("#resultado-financeiro");

if (btnCalcular) {
    btnCalcular.addEventListener("click", () => {
        const custos = parseFloat(inputCustos.value) || 0;
        const vendas = parseFloat(inputVendas.value) || 0;
        const lucro  = vendas - custos;
        const equilibrio = custos;

        estado.saldo = lucro;

        let status = "";
        let classe = "";

        if (lucro > 0) {
            status = "🟢 Produção viável — parabéns!";
            classe = "sucesso";
            adicionarPontos(10);
        } else if (lucro === 0) {
            status = "🟡 Empate financeiro";
            classe = "alerta";
        } else {
            status = "🔴 Prejuízo — revise seus custos";
            classe = "erro";
        }

        atualizarDashboard();

        resultadoFinanceiro.innerHTML = `
            <div class="${classe}" style="margin-bottom:10px">${status}</div>
            <p>💸 Custos: <strong>R$ ${custos.toFixed(2)}</strong></p>
            <p>📈 Vendas: <strong>R$ ${vendas.toFixed(2)}</strong></p>
            <p>💰 Lucro líquido: <strong>R$ ${lucro.toFixed(2)}</strong></p>
            <p>⚖️ Ponto de equilíbrio: <strong>R$ ${equilibrio.toFixed(2)}</strong></p>
        `;
    });
}

/* =========================
   MERCADO DE CARBONO
========================= */

const btnCarbono      = document.querySelector("#btn-carbono");
const areaCarbono     = document.querySelector("#area-carbono");
const manejoCarbono   = document.querySelector("#manejo");
const resultadoCarbono = document.querySelector("#resultado-carbono");

if (btnCarbono) {
    btnCarbono.addEventListener("click", () => {
        const area   = parseFloat(areaCarbono.value);
        const manejo = manejoCarbono.value;

        if (!area || area <= 0) {
            resultadoCarbono.innerHTML = "⚠️ Digite uma área válida.";
            return;
        }
        if (!manejo) {
            resultadoCarbono.innerHTML = "⚠️ Selecione o tipo de manejo.";
            return;
        }

        let fator = 1.1, nomeManejo = "Tradicional";
        if (manejo === "direto") { fator = 2.5; nomeManejo = "Plantio Direto"; }
        if (manejo === "ilpf")   { fator = 4.2; nomeManejo = "ILPF"; }

        const carbono = area * fator;
        const credito = carbono * 75;

        estado.carbono = carbono;
        estado.saldo  += credito;
        adicionarPontos(25);
        atualizarDashboard();

        resultadoCarbono.innerHTML = `
            <p>🌍 Área: <strong>${area} ha</strong></p>
            <p>🔧 Manejo: <strong>${nomeManejo}</strong></p>
            <p>🌱 Carbono retido: <strong>${carbono.toFixed(2)} t</strong></p>
            <p>💵 Crédito gerado: <strong>R$ ${credito.toFixed(2)}</strong></p>
            <p>📊 Fator de captura: <strong>${fator} t/ha</strong></p>
        `;
    });
}

/* =========================
   CLIMA INTELIGENTE
========================= */

const btnClima      = document.querySelector("#btn-clima");
const climaSelect   = document.querySelector("#clima-select");
const resultadoClima = document.querySelector("#resultado-clima");

const dadosClima = {
    ideal: {
        msg: "🌤️ Condições excelentes para plantio e colheita.",
        rec: "Aproveite para plantar tomate, milho e soja.",
        classe: "sucesso",
        impacto: "+15% na produtividade estimada"
    },
    seca: {
        msg: "🔥 Atenção! Déficit hídrico detectado.",
        rec: "Ative irrigação. Priorize culturas resistentes.",
        classe: "alerta",
        impacto: "-30% na produtividade estimada"
    },
    geada: {
        msg: "❄️ Risco alto de perdas por geada.",
        rec: "Proteja estufas e evite plantios novos.",
        classe: "erro",
        impacto: "-50% na produtividade estimada"
    },
    chuva: {
        msg: "🌧️ Excesso de chuva pode causar encharcamento.",
        rec: "Verifique drenagem. Adie colheitas se possível.",
        classe: "alerta",
        impacto: "-20% na produtividade estimada"
    }
};

if (btnClima) {
    btnClima.addEventListener("click", () => {
        const clima = climaSelect.value;
        const dado  = dadosClima[clima];

        estado.clima = clima.charAt(0).toUpperCase() + clima.slice(1);
        if (clima === "ideal") adicionarPontos(5);
        atualizarDashboard();

        resultadoClima.innerHTML = `
            <div class="${dado.classe}" style="margin-bottom:10px">${dado.msg}</div>
            <p>📋 Recomendação: <strong>${dado.rec}</strong></p>
            <p>📉 Impacto: <strong>${dado.impacto}</strong></p>
        `;
    });
}

/* =========================
   GESTÃO DE ESTUFAS
========================= */

const btnEstufa       = document.querySelector("#btn-estufa");
const inputTemperatura = document.querySelector("#temperatura");
const inputUmidade     = document.querySelector("#umidade");
const resultadoEstufa  = document.querySelector("#resultado-estufa");

if (btnEstufa) {
    btnEstufa.addEventListener("click", () => {
        const temp   = parseFloat(inputTemperatura.value);
        const umidad = parseFloat(inputUmidade.value);

        if (isNaN(temp) || isNaN(umidad)) {
            resultadoEstufa.innerHTML = "⚠️ Preencha temperatura e umidade.";
            return;
        }

        let status = "", alertas = [], classe = "sucesso";

        if (temp < 15)       { alertas.push("❄️ Temperatura baixa — risco de geada na estufa"); classe = "erro"; }
        else if (temp > 35)  { alertas.push("🔥 Temperatura alta — risco de queima das plantas"); classe = "erro"; }
        else if (temp > 28)  { alertas.push("⚠️ Temperatura elevada — monitore de perto"); classe = "alerta"; }
        else                  { alertas.push("✅ Temperatura ideal para produção"); }

        if (umidad < 40)      { alertas.push("💧 Umidade baixa — aumente irrigação"); if (classe !== "erro") classe = "alerta"; }
        else if (umidad > 85) { alertas.push("💦 Umidade alta — risco de fungos"); if (classe !== "erro") classe = "alerta"; }
        else                   { alertas.push("✅ Umidade adequada"); }

        resultadoEstufa.innerHTML = `
            <div class="${classe}" style="margin-bottom:10px">
                <strong>Diagnóstico da Estufa</strong>
            </div>
            <p>🌡️ Temperatura: <strong>${temp}°C</strong></p>
            <p>💧 Umidade: <strong>${umidad}%</strong></p>
            <hr style="margin:10px 0">
            ${alertas.map(a => `<p>${a}</p>`).join("")}
        `;
    });
}

/* =========================
   COTAÇÃO CEASA — DINÂMICA COM IA
========================= */

// Preços base de referência (ponto de partida)
let produtosCEASA = [
    { emoji: "🍅", nome: "Tomate",  preco: 4.20,  unidade: "kg",    tendencia: "alta",  precAnterior: 4.00 },
    { emoji: "🥒", nome: "Pepino",  preco: 2.80,  unidade: "kg",    tendencia: "est",   precAnterior: 2.80 },
    { emoji: "🥬", nome: "Alface",  preco: 1.50,  unidade: "maço",  tendencia: "alta",  precAnterior: 1.35 },
    { emoji: "🌽", nome: "Milho",   preco: 1.10,  unidade: "kg",    tendencia: "baixa", precAnterior: 1.25 },
    { emoji: "🌾", nome: "Soja",    preco: 3.75,  unidade: "kg",    tendencia: "alta",  precAnterior: 3.60 },
    { emoji: "🥛", nome: "Leite",   preco: 2.20,  unidade: "litro", tendencia: "est",   precAnterior: 2.20 },
];

let ceasaCarregando = false;
let ultimaAtualizacaoCEASA = null;

// Variação realista dos preços (simula mercado enquanto IA não responde)
function variarPrecos() {
    produtosCEASA = produtosCEASA.map(p => {
        const variacao = (Math.random() - 0.48) * 0.12; // leve tendência de alta
        const novoPreco = Math.max(0.50, p.preco + variacao);
        const diff = novoPreco - p.preco;
        return {
            ...p,
            precAnterior: p.preco,
            preco: novoPreco,
            tendencia: diff > 0.03 ? "alta" : diff < -0.03 ? "baixa" : "est"
        };
    });
}

// Busca cotações via IA
async function atualizarCotacoesComIA() {
    if (ceasaCarregando) return;
    ceasaCarregando = true;

    const statusEl = document.querySelector("#ceasa-status");
    if (statusEl) {
        statusEl.textContent = "🔄 Atualizando cotações com IA...";
        statusEl.style.color = "#888";
    }

    const agora = new Date();
    const hora  = agora.toLocaleTimeString('pt-BR');
    const data  = agora.toLocaleDateString('pt-BR');
    const diaSemana = agora.toLocaleDateString('pt-BR', { weekday: 'long' });

    const precoAtual = produtosCEASA.map(p => `${p.nome}: R$ ${p.preco.toFixed(2)}/${p.unidade}`).join(", ");

    try {
        const resposta = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 1000,
                system: `Você é um simulador de preços do CEASA (Central de Abastecimento) do Paraná, Brasil.
Retorne APENAS um JSON válido, sem texto extra, sem markdown, sem explicação.
Simule preços realistas para o mercado agrícola brasileiro de ${data} (${diaSemana}), horário ${hora}.
Considere sazonalidade, clima e variações normais de mercado.
Formato obrigatório — retorne exatamente este JSON preenchido:
{"produtos":[{"nome":"Tomate","preco":0.00,"tendencia":"alta"},{"nome":"Pepino","preco":0.00,"tendencia":"est"},{"nome":"Alface","preco":0.00,"tendencia":"baixa"},{"nome":"Milho","preco":0.00,"tendencia":"alta"},{"nome":"Soja","preco":0.00,"tendencia":"est"},{"nome":"Leite","preco":0.00,"tendencia":"alta"}],"analise":"frase curta sobre o mercado hoje"}
Tendencia deve ser exatamente: "alta", "baixa" ou "est".
Preços base de referência (varie ±15%): ${precoAtual}.`,
                messages: [{ role: "user", content: `Gere cotações CEASA para ${data} às ${hora}.` }]
            })
        });

        const dados = await resposta.json();
        const texto = dados.content?.[0]?.text || "";

        // Parse seguro do JSON
        const jsonMatch = texto.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const cotacoes = JSON.parse(jsonMatch[0]);

            if (cotacoes.produtos && Array.isArray(cotacoes.produtos)) {
                cotacoes.produtos.forEach(novo => {
                    const idx = produtosCEASA.findIndex(p => p.nome === novo.nome);
                    if (idx >= 0 && novo.preco > 0) {
                        produtosCEASA[idx].precAnterior = produtosCEASA[idx].preco;
                        produtosCEASA[idx].preco        = novo.preco;
                        produtosCEASA[idx].tendencia    = novo.tendencia;
                    }
                });

                ultimaAtualizacaoCEASA = { hora, analise: cotacoes.analise || "" };

                if (statusEl) {
                    statusEl.textContent = `✅ Atualizado às ${hora} — ${cotacoes.analise || ""}`;
                    statusEl.style.color = "#2d6a4f";
                }
            }
        }

    } catch (err) {
        // Se a IA falhar, varia os preços localmente
        variarPrecos();
        if (statusEl) {
            statusEl.textContent = `⚡ Atualizado às ${new Date().toLocaleTimeString('pt-BR')} (modo local)`;
            statusEl.style.color = "#888";
        }
    }

    ceasaCarregando = false;
    renderizarCEASA();
}

function renderizarCEASA() {
    const container = document.querySelector("#tabela-ceasa");
    if (!container) return;

    const icones = { alta: "▲", baixa: "▼", est: "▶" };
    const classes = { alta: "tendencia-alta", baixa: "tendencia-baixa", est: "tendencia-est" };
    const labels  = { alta: "Alta", baixa: "Baixa", est: "Estável" };

    container.innerHTML = `<div class="ceasa-grid">` +
        produtosCEASA.map(p => {
            const diff   = p.preco - p.precAnterior;
            const diffStr = diff >= 0
                ? `<span style="color:#198754;font-size:.75rem">+R$ ${Math.abs(diff).toFixed(2)}</span>`
                : `<span style="color:#dc3545;font-size:.75rem">-R$ ${Math.abs(diff).toFixed(2)}</span>`;
            return `
            <div class="ceasa-card">
                <span class="emoji">${p.emoji}</span>
                <div class="nome">${p.nome}</div>
                <div class="preco">R$ ${p.preco.toFixed(2)}</div>
                <div class="unidade">por ${p.unidade}</div>
                <div style="margin:3px 0">${diffStr}</div>
                <div class="${classes[p.tendencia]}">${icones[p.tendencia]} ${labels[p.tendencia]}</div>
            </div>`;
        }).join("") + `</div>`;
}

// Atualiza visualmente a cada 30 segundos (variação local)
// Busca cotação da IA a cada 5 minutos
function iniciarCEASA() {
    renderizarCEASA();
    atualizarCotacoesComIA(); // primeira chamada imediata

    // Variação local a cada 30s (mantém o mercado "vivo")
    setInterval(() => {
        variarPrecos();
        renderizarCEASA();
    }, 30000);

    // Atualiza via IA a cada 5 minutos
    setInterval(atualizarCotacoesComIA, 5 * 60 * 1000);
}

iniciarCEASA();

/* =========================
   NOTÍCIAS — DINÂMICAS COM IA
========================= */

let noticiasList = [
    { emoji: "🌾", titulo: "Mercado da soja em alta", texto: "Soja apresenta alta nesta semana no Paraná.", tempo: "Agora" },
    { emoji: "🌽", titulo: "Milho safrinha cresce", texto: "Milho safrinha mantém crescimento na região Sul.", tempo: "Agora" },
    { emoji: "🥒", titulo: "Pepino em expansão", texto: "Produção de pepino cresce nas estufas do interior.", tempo: "Agora" },
];

let noticiasCarregando = false;

function renderizarNoticias() {
    const listaNoticias = document.querySelector("#lista-noticias");
    if (!listaNoticias) return;

    listaNoticias.innerHTML = noticiasList.map(n => `
        <div class="noticia">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                <strong style="color:var(--verde-principal)">${n.emoji} ${n.titulo}</strong>
                <span style="font-size:.75rem; color:#aaa">${n.tempo}</span>
            </div>
            <p style="margin:0; font-size:.95rem">${n.texto}</p>
        </div>
    `).join("");
}

async function atualizarNoticiasComIA() {
    if (noticiasCarregando) return;
    noticiasCarregando = true;

    const statusEl = document.querySelector("#noticias-status");
    if (statusEl) {
        statusEl.textContent = "🔄 Buscando notícias...";
        statusEl.style.color = "#888";
    }

    const agora = new Date();
    const data  = agora.toLocaleDateString('pt-BR');
    const hora  = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const mes   = agora.toLocaleDateString('pt-BR', { month: 'long' });

    try {
        const resposta = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 1000,
                system: `Você é um gerador de notícias agrícolas brasileiras realistas para o AgroViva.
Retorne APENAS um JSON válido, sem texto extra, sem markdown, sem explicação.
Gere 6 notícias agrícolas variadas e realistas para ${data} (mês de ${mes}), considerando sazonalidade do agronegócio brasileiro.
Cubra temas variados: mercado de grãos, horticultura, clima, tecnologia rural, sustentabilidade, CEASA.
Formato obrigatório:
{"noticias":[{"emoji":"🌾","titulo":"Título curto","texto":"Descrição de 1 frase informativa e realista."},...],"hora":"${hora}"}
Use emojis variados: 🌾🌽🍅🥒🥬🌱🚜💧🌦️📈💰🔬`,
                messages: [{ role: "user", content: `Gere notícias agrícolas para ${data} às ${hora}.` }]
            })
        });

        const dados = await resposta.json();
        const texto = dados.content?.[0]?.text || "";

        const jsonMatch = texto.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const resultado = JSON.parse(jsonMatch[0]);

            if (resultado.noticias && Array.isArray(resultado.noticias)) {
                noticiasList = resultado.noticias.map((n, i) => ({
                    ...n,
                    tempo: i === 0 ? "Agora" : `${(i * 8)}min atrás`
                }));

                renderizarNoticias();

                if (statusEl) {
                    statusEl.textContent = `✅ Atualizado às ${hora}`;
                    statusEl.style.color = "#2d6a4f";
                }
            }
        }

    } catch (err) {
        if (statusEl) {
            statusEl.textContent = `⚡ Última atualização: ${hora}`;
            statusEl.style.color = "#888";
        }
    }

    noticiasCarregando = false;
}

function iniciarNoticias() {
    renderizarNoticias();
    atualizarNoticiasComIA();
    setInterval(atualizarNoticiasComIA, 10 * 60 * 1000);
}

iniciarNoticias();

/* =========================
   RANKING
========================= */

const ranking = [
    { nome: "Pedro", pontos: 1500 },
    { nome: "Maria", pontos: 1200 },
    { nome: "João",  pontos:  950 },
];

function atualizarRanking() {
    const lista = document.querySelector("#lista-ranking");
    if (!lista) return;

    const medalhas = ["🥇", "🥈", "🥉"];

    lista.innerHTML = ranking
        .slice(0, 10)
        .map((j, i) => `
            <li style="padding:8px 0; border-bottom:1px solid #eee;">
                ${medalhas[i] || `${i+1}.`}
                <strong>${j.nome}</strong> — ${j.pontos} pts
            </li>
        `)
        .join("");
}

atualizarRanking();

/* =========================
   ASSISTENTE IA (Claude API)
========================= */

const btnPerguntar = document.querySelector("#btn-perguntar");
const inputPergunta = document.querySelector("#pergunta-ia");
const historicoIA  = document.querySelector("#historico-ia");
const textoIA      = document.querySelector("#texto-ia");

if (textoIA) textoIA.style.display = "none";

const historicoMensagens = [];

async function perguntarIA(pergunta) {
    if (!pergunta.trim()) return;

    // Mostra mensagem do usuário
    const msgUser = document.createElement("div");
    msgUser.className = "msg-usuario";
    msgUser.textContent = pergunta;
    historicoIA.appendChild(msgUser);

    // Mostra "digitando..."
    const msgLoading = document.createElement("div");
    msgLoading.className = "msg-carregando";
    msgLoading.textContent = "🤖 AgroViva IA está digitando...";
    historicoIA.appendChild(msgLoading);
    historicoIA.scrollTop = historicoIA.scrollHeight;

    inputPergunta.value = "";
    inputPergunta.disabled = true;
    btnPerguntar.disabled  = true;

    historicoMensagens.push({ role: "user", content: pergunta });

    try {
        const resposta = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 1000,
                system: `Você é o assistente do AgroViva, um sistema inteligente de gestão agrícola brasileiro.
Seu nome é AgroViva IA. Responda SEMPRE em português brasileiro de forma clara, prática e amigável.
Foque em agricultura, plantio, colheita, clima, mercado agrícola, manejo de estufas e sustentabilidade.
Seja objetivo — respostas com no máximo 3 parágrafos curtos. Use emojis para deixar a resposta mais visual.
Contexto atual do produtor: Saldo R$ ${estado.saldo.toFixed(2)}, Clima: ${estado.clima}, Carbono: ${estado.carbono.toFixed(2)} t.`,
                messages: historicoMensagens
            })
        });

        const dados = await resposta.json();
        const textoResposta = dados.content?.[0]?.text || "Não consegui processar sua pergunta.";

        historicoMensagens.push({ role: "assistant", content: textoResposta });

        msgLoading.remove();

        const msgIA = document.createElement("div");
        msgIA.className = "msg-ia";
        msgIA.textContent = textoResposta;
        historicoIA.appendChild(msgIA);

    } catch (err) {
        msgLoading.remove();
        const msgErro = document.createElement("div");
        msgErro.className = "msg-ia";
        msgErro.textContent = "⚠️ Erro ao conectar com a IA. Tente novamente.";
        historicoIA.appendChild(msgErro);
    }

    inputPergunta.disabled = false;
    btnPerguntar.disabled  = false;
    historicoIA.scrollTop  = historicoIA.scrollHeight;
}

if (btnPerguntar) {
    btnPerguntar.addEventListener("click", () => {
        perguntarIA(inputPergunta.value);
    });
}

if (inputPergunta) {
    inputPergunta.addEventListener("keydown", (e) => {
        if (e.key === "Enter") perguntarIA(inputPergunta.value);
    });
}

/* =========================
   INICIALIZAÇÃO
========================= */

atualizarDashboard();
console.log("✅ AgroViva carregado com sucesso.");
/* =====================================================
   AGROVIVA HARVEST - MINIGAME
===================================================== */

const canvas = document.getElementById("gameCanvas");

if (canvas) {

    const ctx = canvas.getContext("2d");

    let score = 0;
    let nivel = 1;
    const scoreElement = document.getElementById("score");

    /* ======================================
       TRATOR
    ====================================== */

    const trator = {
        x: 350,
        y: 320,
        largura: 70,
        altura: 50,
        velocidade: 8
    };

    /* ======================================
       ITENS DA COLHEITA
    ====================================== */

    const emojis = ["🍅", "🥒", "🥬", "🌽", "🥛"];
    let itens = [];

    function criarItem() {
        itens.push({
            x: Math.random() * (canvas.width - 40),
            y: -30,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            velocidade: (2 + Math.random() * 3) * (1 + nivel * 0.1)
        });
    }

    /* ======================================
       CONTROLES TECLADO
    ====================================== */

    let esquerda = false;
    let direita  = false;

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft")  esquerda = true;
        if (e.key === "ArrowRight") direita  = true;
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft")  esquerda = false;
        if (e.key === "ArrowRight") direita  = false;
    });

    /* ======================================
       CONTROLES TOUCH (CELULAR)
    ====================================== */

    const btnEsquerda = document.getElementById("btn-esquerda");
    const btnDireita  = document.getElementById("btn-direita");

    if (btnEsquerda) {
        btnEsquerda.addEventListener("touchstart", (e) => { e.preventDefault(); esquerda = true; });
        btnEsquerda.addEventListener("touchend",   (e) => { e.preventDefault(); esquerda = false; });
        btnEsquerda.addEventListener("mousedown",  ()  => { esquerda = true; });
        btnEsquerda.addEventListener("mouseup",    ()  => { esquerda = false; });
    }

    if (btnDireita) {
        btnDireita.addEventListener("touchstart", (e) => { e.preventDefault(); direita = true; });
        btnDireita.addEventListener("touchend",   (e) => { e.preventDefault(); direita = false; });
        btnDireita.addEventListener("mousedown",  ()  => { direita = true; });
        btnDireita.addEventListener("mouseup",    ()  => { direita = false; });
    }

    /* ======================================
       DESENHAR FUNDO
    ====================================== */

    function desenharFundo() {
        // Céu
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.8);

        // Sol
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(700, 50, 35, 0, Math.PI * 2);
        ctx.fill();

        // Chão
        ctx.fillStyle = "#52b788";
        ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);

        // Terra
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

        // Pontuação e nível no canvas
        ctx.fillStyle = "#1b4332";
        ctx.font = "bold 18px Arial";
        ctx.fillText(`⭐ ${score} pts`, 10, 30);
        ctx.fillText(`🚜 Nível ${nivel}`, 10, 55);
    }

    /* ======================================
       DESENHAR TRATOR
    ====================================== */

    function desenharTrator() {
        ctx.font = "50px Arial";
        ctx.fillText("🚜", trator.x, trator.y + trator.altura);
    }

    /* ======================================
       DESENHAR ITENS
    ====================================== */

    function desenharItens() {
        ctx.font = "30px Arial";
        itens.forEach((item) => {
            ctx.fillText(item.emoji, item.x, item.y);
        });
    }

    /* ======================================
       ATUALIZAR LÓGICA
    ====================================== */

    function atualizar() {
        if (esquerda) trator.x -= trator.velocidade;
        if (direita)  trator.x += trator.velocidade;

        if (trator.x < 0)              trator.x = 0;
        if (trator.x > canvas.width - trator.largura) trator.x = canvas.width - trator.largura;

        itens.forEach((item, indice) => {
            item.y += item.velocidade;

            // Colisão com o trator
            if (
                item.x > trator.x - 20 &&
                item.x < trator.x + trator.largura &&
                item.y > trator.y &&
                item.y < trator.y + trator.altura + 30
            ) {
                itens.splice(indice, 1);
                score += 10;
                if (scoreElement) scoreElement.textContent = score;

                // Chama função do script.js
                if (typeof adicionarPontos === "function") {
                    adicionarPontos(10);
                }

                // Sobe de nível a cada 100 pontos
                nivel = Math.floor(score / 100) + 1;
            }

            // Item saiu da tela (perdeu)
            if (item.y > canvas.height) {
                itens.splice(indice, 1);
            }
        });
    }

    /* ======================================
       LOOP PRINCIPAL
    ====================================== */

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        desenharFundo();
        atualizar();
        desenharItens();
        desenharTrator();
        requestAnimationFrame(loop);
    }

    /* ======================================
       SPAWN DOS ITENS
    ====================================== */

    setInterval(criarItem, 1200);

    loop();

    /* ======================================
       SALVAR RECORDE LOCAL
    ====================================== */

    window.addEventListener("beforeunload", () => {
        try {
            localStorage.setItem("agrovivaScore", score);
        } catch(e) {}
    });
}
