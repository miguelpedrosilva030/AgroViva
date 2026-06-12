/* ==================================================
   AGROVIVA - SCRIPT.JS (Lógica Front-End Pura)
   ================================================== */

const estado = { saldo: 0, carbono: 0, clima: "Ideal", pontos: 0 };

function adicionarPontos(qtd) {
    estado.pontos += qtd;
    atualizarDashboard();
    
    let ranking = JSON.parse(localStorage.getItem('rankingAgro')) || [];
    const idx = ranking.findIndex(j => j.nome === "Sua Fazenda");
    if (idx >= 0) ranking[idx].pontos = estado.pontos;
    else ranking.push({ nome: "Sua Fazenda", pontos: estado.pontos });
    
    ranking.sort((a, b) => b.pontos - a.pontos);
    localStorage.setItem('rankingAgro', JSON.stringify(ranking));
    atualizarRanking();
}

const telaEntrada = document.querySelector("#tela-entrada");
document.querySelector("#btn-entrar")?.addEventListener("click", () => {
    telaEntrada.style.opacity = "0";
    setTimeout(() => telaEntrada.style.display = "none", 600);
});

function atualizarDashboard() {
    document.querySelector("#saldo").innerText = `R$ ${estado.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.querySelector("#carbono").innerText = `${estado.carbono.toFixed(2)} t`;
    document.querySelector("#clima-atual").innerText = estado.clima;
    document.querySelector("#pontos").innerText = estado.pontos;
}

// Navegação de Abas
const abas = document.querySelectorAll(".aba");
const conteudos = document.querySelectorAll(".conteudo");
abas.forEach(botao => {
    botao.addEventListener("click", () => {
        abas.forEach(a => a.classList.remove("ativa"));
        conteudos.forEach(c => c.classList.remove("ativa"));
        botao.classList.add("ativa");
        document.querySelector("#" + botao.dataset.aba).classList.add("ativa");
    });
});

// Calculadora Financeira
document.querySelector("#btn-calcular")?.addEventListener("click", () => {
    const custos = parseFloat(document.querySelector("#custos").value) || 0;
    const vendas = parseFloat(document.querySelector("#vendas").value) || 0;
    const lucro = vendas - custos;
    estado.saldo += lucro;
    adicionarPontos(15);
    atualizarDashboard();
    document.querySelector("#resultado-financeiro").innerHTML = `
        <p><strong>Lucro Estimado:</strong> R$ ${lucro.toFixed(2)}</p>
        <p><em>${lucro > 0 ? '✅ Operação Sustentável' : '⚠️ Alerta de Prejuízo'}</em></p>
    `;
});

// Mercado de Carbono
document.querySelector("#btn-carbono")?.addEventListener("click", () => {
    const area = parseFloat(document.querySelector("#area-carbono").value) || 0;
    const manejo = document.querySelector("#manejo").value;
    let fator = manejo === "ilpf" ? 4.2 : manejo === "direto" ? 2.5 : 1.1;
    
    const carbonoGerado = area * fator;
    estado.carbono += carbonoGerado;
    estado.saldo += (carbonoGerado * 80); // R$ 80 por tonelada
    adicionarPontos(30);
    atualizarDashboard();
    document.querySelector("#resultado-carbono").innerHTML = `<p>✅ <strong>${carbonoGerado.toFixed(2)} t</strong> de carbono retidas. Saldo atualizado!</p>`;
});

// Simulador Climático
document.querySelector("#btn-clima")?.addEventListener("click", () => {
    const clima = document.querySelector("#clima-select").value;
    const efeitos = {
        ideal: { texto: "Clima perfeito! Produtividade alta.", pts: 10, exibe: "Ideal" },
        seca: { texto: "Alerta hídrico. Acione a irrigação.", pts: -5, exibe: "Seca" },
        geada: { texto: "Perigo iminente. Proteja a lavoura.", pts: -10, exibe: "Geada" },
        chuva: { texto: "Risco de fungos. Monitore as folhas.", pts: -5, exibe: "Chuva Extrema" }
    };
    estado.clima = efeitos[clima].exibe;
    adicionarPontos(efeitos[clima].pts);
    document.querySelector("#resultado-clima").innerHTML = `<p><strong>Previsão:</strong> ${efeitos[clima].texto}</p>`;
});

// CEASA Local (Simulação Dinâmica com Arrays JS)
let produtos = [
    { emoji: "🍅", nome: "Tomate", preco: 4.50 }, { emoji: "🌽", nome: "Milho", preco: 1.20 },
    { emoji: "🌾", nome: "Soja", preco: 3.80 }, { emoji: "🥬", nome: "Alface", preco: 2.00 }
];

function atualizarCEASA() {
    produtos.forEach(p => { p.preco += (Math.random() - 0.45) * 0.2; });
    document.querySelector("#tabela-ceasa").innerHTML = `<div class="ceasa-grid">` + 
        produtos.map(p => `
            <div class="ceasa-card">
                <div class="emoji">${p.emoji}</div>
                <div>${p.nome}</div>
                <div class="preco">R$ ${Math.max(0.5, p.preco).toFixed(2)}</div>
            </div>
        `).join("") + `</div>`;
}
setInterval(atualizarCEASA, 5000);
atualizarCEASA();

// Notícias Estáticas com Imagens IA
const noticias = [
    { img: "img/noticia-soja.jpg", titulo: "Mercado de Grãos Dispara", texto: "Alta tecnologia impulsiona o mercado agrícola no Sul." },
    { img: "img/noticia-tecnologia.jpg", titulo: "Sensores no Campo", texto: "A revolução dos dados na prevenção de perdas de safra." },
    { img: "img/noticia-estufa.jpg", titulo: "Estufas Inteligentes", texto: "Produção hidropônica reduz o uso de água em 80%." }
];
document.querySelector("#lista-noticias").innerHTML = noticias.map(n => `
    <div class="noticia">
        <img src="${n.img}" class="img-noticia" alt="Imagem Notícia">
        <div><h3 style="color:var(--verde-principal)">${n.titulo}</h3><p>${n.texto}</p></div>
    </div>
`).join("");

// Assistente IA Local Baseado em Regras (Sem API externa)
document.querySelector("#btn-perguntar")?.addEventListener("click", () => {
    const input = document.querySelector("#pergunta-ia");
    const pergunta = input.value.toLowerCase();
    if(!pergunta) return;

    const hist = document.querySelector("#historico-ia");
    hist.innerHTML += `<div class="msg-usuario">${input.value}</div>`;
    input.value = "";

    setTimeout(() => {
        let resposta = "Sou o assistente AgroViva! Posso ajudar com dicas sobre seu clima, seu saldo ou plantio sustentável.";
        if (pergunta.includes("clima")) resposta = `No momento, enfrentamos condições de ${estado.clima}. Recomendo verificar o calendário agrícola para culturas resistentes.`;
        if (pergunta.includes("saldo") || pergunta.includes("dinheiro")) resposta = `Seu caixa atual é de R$ ${estado.saldo.toFixed(2)}. Invista no Mercado de Carbono para aumentar os lucros!`;
        if (pergunta.includes("dica") || pergunta.includes("plantar")) resposta = `Dica de Ouro: O sistema ILPF (Integração Lavoura-Pecuária-Floresta) gera mais créditos de carbono e protege o solo!`;

        hist.innerHTML += `<div class="msg-ia">${resposta}</div>`;
        hist.scrollTop = hist.scrollHeight;
    }, 600);
});

// Ranking Local Storage
function atualizarRanking() {
    let ranking = JSON.parse(localStorage.getItem('rankingAgro')) || [{nome: "Fazenda Modelo", pontos: 500}];
    document.querySelector("#lista-ranking").innerHTML = ranking.slice(0,5).map((r, i) => `<li>${i+1}º ${r.nome} - <strong>${r.pontos} pts</strong></li>`).join("");
}
atualizarRanking();
