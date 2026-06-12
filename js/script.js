/* ==================================================
   AGROVIVA - SCRIPT.JS (Lógica Front-End)
   ================================================== */

const estado = { saldo: 0, carbono: 0, clima: "Ideal", pontos: 0 };

function atualizarDashboard() {
    const elSaldo = document.querySelector("#saldo");
    const elCarbono = document.querySelector("#carbono");
    const elClima = document.querySelector("#clima-atual");
    const elPontos = document.querySelector("#pontos");

    if(elSaldo) elSaldo.innerText = `R$ ${estado.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if(elCarbono) elCarbono.innerText = `${estado.carbono.toFixed(2)} t`;
    if(elClima) elClima.innerText = estado.clima;
    if(elPontos) elPontos.innerText = estado.pontos;
}

// ================= FERRAMENTAS ================= //

document.querySelector("#btn-calcular")?.addEventListener("click", () => {
    const custos = parseFloat(document.querySelector("#custos").value) || 0;
    const vendas = parseFloat(document.querySelector("#vendas").value) || 0;
    const lucro = vendas - custos;
    
    estado.saldo += lucro;
    estado.pontos += 15;
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-financeiro");
    res.style.display = "block";
    res.innerHTML = `<strong>Lucro Projetado:</strong> R$ ${lucro.toFixed(2)} <br> ${lucro > 0 ? '✅ Safra viável' : '⚠️ Risco financeiro'}`;
});

document.querySelector("#btn-carbono")?.addEventListener("click", () => {
    const area = parseFloat(document.querySelector("#area-carbono").value) || 0;
    const manejo = document.querySelector("#manejo").value;
    let fator = manejo === "ilpf" ? 4.2 : manejo === "direto" ? 2.5 : 1.1;
    
    const carbonoGerado = area * fator;
    estado.carbono += carbonoGerado;
    estado.saldo += (carbonoGerado * 80); 
    estado.pontos += 30;
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-carbono");
    res.style.display = "block";
    res.innerHTML = `✅ <strong>${carbonoGerado.toFixed(2)} t</strong> de CO2 retidas. Créditos aplicados no saldo!`;
});

document.querySelector("#btn-clima")?.addEventListener("click", () => {
    const clima = document.querySelector("#clima-select").value;
    const efeitos = {
        ideal: { texto: "Janela de plantio perfeita.", pts: 10, exibe: "Ideal" },
        seca: { texto: "Ative a irrigação de precisão.", pts: -5, exibe: "Seca" },
        geada: { texto: "Alerta térmico. Proteja as mudas.", pts: -10, exibe: "Geada" },
        chuva: { texto: "Monitore a drenagem do solo.", pts: -5, exibe: "Chuva" }
    };
    
    estado.clima = efeitos[clima].exibe;
    estado.pontos += efeitos[clima].pts;
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-clima");
    res.style.display = "block";
    res.innerHTML = `<strong>Análise:</strong> ${efeitos[clima].texto}`;
});

document.querySelector("#btn-estufa")?.addEventListener("click", () => {
    const temp = parseFloat(document.querySelector("#temperatura").value) || 0;
    const res = document.querySelector("#resultado-estufa");
    res.style.display = "block";
    if(temp > 30) res.innerHTML = "🔥 Ambiente sobreaquecido! Recomendação: Ligar exaustores.";
    else if(temp < 15) res.innerHTML = "❄️ Temperatura crítica! Recomendação: Ativar sistema térmico.";
    else res.innerHTML = "✅ Parâmetros perfeitos para cultivo protegido.";
});

// ================= RENDERIZAR NOTÍCIAS ================= //

const noticiasData = [
    { img: "img/noticia-soja.jpg", titulo: "Mercado Agrícola", texto: "Plataformas digitais otimizam a venda direta de grãos, aumentando a margem do produtor em até 20%." },
    { img: "img/noticia-tecnologia.jpg", titulo: "Agricultura de Precisão", texto: "Sensores IoT nas lavouras do Paraná ajudam a combater pragas antes que se espalhem." },
    { img: "img/noticia-estufa.jpg", titulo: "O Futuro das Estufas", texto: "Sistemas hidropônicos integrados a inteligência artificial prometem reduzir o uso de água." }
];

const containerNoticias = document.querySelector("#lista-noticias");
if (containerNoticias) {
    containerNoticias.innerHTML = noticiasData.map(n => `
        <div class="noticia-card">
            <img src="${n.img}" alt="Imagem Noticia" class="noticia-img">
            <div class="noticia-conteudo">
                <h4>${n.titulo}</h4>
                <p class="texto-apoio">${n.texto}</p>
            </div>
        </div>
    `).join("");
}

// Inicializa o Dashboard
atualizarDashboard();
