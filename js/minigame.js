/* =====================================================
   AGROVIVA HARVEST - MINIGAME (Com Dificuldade Progressiva)
===================================================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let scorePartida = 0;
let gameOver = false;
let gameLoopId = null;
let spawnerId = null;
let nomeAtual = "Anônimo";

// Variáveis de Dificuldade Dinâmica
let dificuldadeMultiplicador = 1;
let tempoDeSpawn = 1000; // Tempo em milissegundos para nascer novo item

const trator = { x: 265, y: 280, largura: 70, altura: 50, vel: 7 };

const emojisBons = ["🍅", "🌽", "🌾", "🥬"];
const emojisRuins = ["🪨", "🪵"]; 
let itens = [];
let esq = false, dir = false;

document.addEventListener("keydown", (e) => { if(e.key === "ArrowLeft") esq = true; if(e.key === "ArrowRight") dir = true; });
document.addEventListener("keyup", (e) => { if(e.key === "ArrowLeft") esq = false; if(e.key === "ArrowRight") dir = false; });

document.getElementById("btn-esquerda")?.addEventListener("touchstart", (e) => { e.preventDefault(); esq = true; });
document.getElementById("btn-esquerda")?.addEventListener("touchend", () => { esq = false; });
document.getElementById("btn-direita")?.addEventListener("touchstart", (e) => { e.preventDefault(); dir = true; });
document.getElementById("btn-direita")?.addEventListener("touchend", () => { dir = false; });

// --- INICIAR JOGO ---
document.getElementById("btn-play")?.addEventListener("click", tentarIniciarJogo);
document.getElementById("btn-restart")?.addEventListener("click", iniciarJogo);

function tentarIniciarJogo() {
    const inputNome = document.getElementById("nome-jogador").value.trim();
    if (inputNome === "") {
        alert("⚠️ Digite seu nome para registrar sua pontuação no Ranking!");
        return;
    }
    nomeAtual = inputNome;
    iniciarJogo();
}

function iniciarJogo() {
    // Reseta todas as variáveis e a dificuldade
    scorePartida = 0;
    itens = [];
    trator.x = 265;
    gameOver = false;
    dificuldadeMultiplicador = 1;
    tempoDeSpawn = 1000;

    // Esconde as telas de overlay
    document.getElementById("tela-start-jogo").style.display = "none";
    document.getElementById("tela-game-over").style.display = "none";
    
    // Limpa loops anteriores para não bugar
    if (spawnerId) clearTimeout(spawnerId);
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    
    loopSpawn();
    loop();
}

function loopSpawn() {
    if (gameOver) return;
    criarItem();
    // Usa setTimeout recursivo para permitir mudança no tempo de spawn
    spawnerId = setTimeout(loopSpawn, tempoDeSpawn);
}

function criarItem() {
    if (gameOver) return;
    
    const isObstaculo = Math.random() > 0.8; 
    const lista = isObstaculo ? emojisRuins : emojisBons;
    const emojiSorteado = lista[Math.floor(Math.random() * lista.length)];

    itens.push({ 
        x: Math.random() * (canvas.width - 40), 
        y: -30, 
        emoji: emojiSorteado, 
        // A velocidade base é multiplicada pela dificuldade
        vel: (3 + Math.random() * 2) * dificuldadeMultiplicador,
        bad: isObstaculo
    });
}

function salvarRanking(pontosFinais) {
    let ranking = JSON.parse(localStorage.getItem('rankingAgroViva')) || [
        {nome: "Miguel Pedro", pontos: 200},
        {nome: "Fazenda Elite", pontos: 150},
        {nome: "Colheita Pró", pontos: 100}
    ];
    
    ranking.push({ nome: nomeAtual, pontos: pontosFinais });
    ranking.sort((a, b) => b.pontos - a.pontos);
    
    localStorage.setItem('rankingAgroViva', JSON.stringify(ranking));
    atualizarRanking();
}

function atualizarRanking() {
    let ranking = JSON.parse(localStorage.getItem('rankingAgroViva')) || [];
    const listaHtml = document.querySelector("#lista-ranking");
    if(listaHtml) {
        listaHtml.innerHTML = ranking.slice(0,3).map((r, i) => `<li>${i+1}º ${r.nome} <span>${r.pontos} pts</span></li>`).join("");
    }
}

function encerrarJogo() {
    salvarRanking(scorePartida);
    clearTimeout(spawnerId);
    
    // Atualiza o texto da pontuação no HTML e exibe a tela de Game Over
    document.getElementById("pontuacao-final").innerText = scorePartida;
    document.getElementById("tela-game-over").style.display = "flex";
}

function atualizarGame() {
    if (gameOver) return;

    if (esq && trator.x > 0) trator.x -= trator.vel;
    if (dir && trator.x < canvas.width - trator.largura) trator.x += trator.vel;

    itens.forEach((item, i) => {
        item.y += item.vel;
        
        if (item.y > trator.y - 10 && item.y < trator.y + trator.altura && item.x > trator.x - 20 && item.x < trator.x + trator.largura) {
            itens.splice(i, 1);
            
            if (item.bad) {
                gameOver = true;
                encerrarJogo(); // Chama a função sem o setTimeout travado
            } else {
                scorePartida += 10;
                
                // SISTEMA DE DIFICULDADE: A cada 50 pontos, o jogo fica mais insano!
                if (scorePartida % 50 === 0) {
                    dificuldadeMultiplicador += 0.2; // Aumenta a velocidade de queda
                    tempoDeSpawn = Math.max(300, tempoDeSpawn - 100); // Nascem mais rápido (limite máx de 300ms)
                }
            }
        }
    });
    itens = itens.filter(item => item.y < canvas.height);
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#654321"; 
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    ctx.fillStyle = "#87CEEB"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height - 30);

    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`Carga: ${scorePartida}`, 15, 30);
    
    ctx.font = "35px Arial";
    itens.forEach(item => ctx.fillText(item.emoji, item.x, item.y));
    
    ctx.font = "50px Arial";
    ctx.fillText("🚜", trator.x, trator.y + 40);
}

function loop() {
    if (gameOver) return; // Se bateu, para de redesenhar a tela
    atualizarGame();
    desenhar();
    gameLoopId = requestAnimationFrame(loop);
}

// Renderiza a tela parada ao carregar a página
desenhar();
atualizarRanking();
