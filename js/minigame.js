/* =====================================================
   AGROVIVA HARVEST - MINIGAME COM OBSTÁCULOS
===================================================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let scorePartida = 0;
let gameOver = false;

const trator = { x: 265, y: 280, largura: 70, altura: 50, vel: 7 };

// Coisas boas (+10 pts) e Coisas ruins (Game Over)
const emojisBons = ["🍅", "🌽", "🌾", "🥬"];
const emojisRuins = ["🪨", "🪵"]; // Pedra e Tronco
let itens = [];

let esq = false, dir = false;

// Controles Teclado
document.addEventListener("keydown", (e) => { if(e.key === "ArrowLeft") esq = true; if(e.key === "ArrowRight") dir = true; });
document.addEventListener("keyup", (e) => { if(e.key === "ArrowLeft") esq = false; if(e.key === "ArrowRight") dir = false; });

// Controles Mobile
document.getElementById("btn-esquerda")?.addEventListener("touchstart", (e) => { e.preventDefault(); esq = true; });
document.getElementById("btn-esquerda")?.addEventListener("touchend", () => { esq = false; });
document.getElementById("btn-direita")?.addEventListener("touchstart", (e) => { e.preventDefault(); dir = true; });
document.getElementById("btn-direita")?.addEventListener("touchend", () => { dir = false; });

function criarItem() {
    if (gameOver) return;
    
    // 20% de chance de vir um obstáculo
    const isObstaculo = Math.random() > 0.8; 
    const lista = isObstaculo ? emojisRuins : emojisBons;
    const emojiSorteado = lista[Math.floor(Math.random() * lista.length)];

    itens.push({ 
        x: Math.random() * (canvas.width - 40), 
        y: -30, 
        emoji: emojiSorteado, 
        vel: 3 + Math.random() * 2,
        bad: isObstaculo
    });
}

function salvarRanking(pontosFinais) {
    let ranking = JSON.parse(localStorage.getItem('rankingAgroViva')) || [
        {nome: "Miguel Pedro", pontos: 200},
        {nome: "Fazenda Modelo", pontos: 150}
    ];
    
    ranking.push({ nome: "Você (Última Partida)", pontos: pontosFinais });
    ranking.sort((a, b) => b.pontos - a.pontos);
    
    localStorage.setItem('rankingAgroViva', JSON.stringify(ranking));
    atualizarRanking();
}

function atualizarRanking() {
    let ranking = JSON.parse(localStorage.getItem('rankingAgroViva')) || [];
    const listaHtml = document.querySelector("#lista-ranking");
    if(listaHtml) {
        listaHtml.innerHTML = ranking.slice(0,5).map((r, i) => `<li>${i+1}º ${r.nome} <span>${r.pontos} pts</span></li>`).join("");
    }
}

function resetarJogo() {
    salvarRanking(scorePartida);
    alert(`💥 FIM DE JOGO! Você bateu num obstáculo.\nSua colheita rendeu: ${scorePartida} pontos.`);
    scorePartida = 0;
    itens = [];
    trator.x = 265;
    gameOver = false;
}

function atualizarGame() {
    if (gameOver) return;

    if (esq && trator.x > 0) trator.x -= trator.vel;
    if (dir && trator.x < canvas.width - trator.largura) trator.x += trator.vel;

    itens.forEach((item, i) => {
        item.y += item.vel;
        
        // Verificação de Colisão
        if (item.y > trator.y - 10 && item.y < trator.y + trator.altura && item.x > trator.x - 20 && item.x < trator.x + trator.largura) {
            itens.splice(i, 1);
            
            if (item.bad) {
                gameOver = true;
                setTimeout(resetarJogo, 100); // Dá um tempo mínimo pro render antes do alert
            } else {
                scorePartida += 10;
            }
        }
    });

    // Remove do array itens que caíram para fora da tela
    itens = itens.filter(item => item.y < canvas.height);
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chão
    ctx.fillStyle = "#654321"; // Marrom escuro
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Céu azul
    ctx.fillStyle = "#87CEEB"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height - 30);

    // Score na tela do canvas
    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`Carga: ${scorePartida}`, 15, 30);
    
    // Itens caindo
    ctx.font = "35px Arial";
    itens.forEach(item => ctx.fillText(item.emoji, item.x, item.y));
    
    // O Trator
    ctx.font = "50px Arial";
    ctx.fillText("🚜", trator.x, trator.y + 40);
}

function loop() {
    atualizarGame();
    desenhar();
    requestAnimationFrame(loop);
}

// Inicia spawn e o loop
setInterval(criarItem, 1000);
loop();
atualizarRanking(); // Preenche o ranking inicial
