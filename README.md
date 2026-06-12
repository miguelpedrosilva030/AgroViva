# 🌱 AgroViva — Inteligência, Gestão e Sustentabilidade

> Projeto desenvolvido para o **Concurso Agrinho 2026**
> Subcategoria 3: Ensino Médio — Programação Front-End

Aplicação web interativa voltada para o setor agrícola sustentável, alinhada ao tema oficial do concurso: *"Agro forte, futuro sustentável: equilíbrio entre produção e meio ambiente"*.

**🔗 Acesse o projeto:** [https://miguelpedrosilva030.github.io/agroviva/](https://miguelpedrosilva030.github.io/agroviva/)

---

## 🎯 Objetivo

Demonstrar como a tecnologia pode auxiliar o produtor rural na tomada de decisões precisas, por meio de simuladores interativos focados em gestão financeira, mercado de carbono, previsões climáticas e diagnósticos de biometria e estufas.

---

## ✨ Funcionalidades

- **Calculadora Financeira** — Projeções de receita e despesas para a propriedade rural.
- **Mercado de Carbono** — Cálculo de créditos de carbono com base na atividade produtiva.
- **Simulador Climático** — Previsões e análises de impacto climático na safra.
- **Diagnóstico de Estufa** — Leitura de sensores e biometria para controle de ambiente.
- **Desafio Colheita AgroViva** — Minigame interativo com ranking local salvo em LocalStorage.

---

## 📖 Instruções de Uso

1. **Configuração inicial** — Na seção "Passo 1: Configure sua Produção", insira o nome da propriedade e escolha a cultura principal para liberar o Dashboard.
2. **Navegação** — Use o menu superior fixo para transitar entre "Desafios", "Gestão" e "MiniGame".
3. **Simuladores** — Na Central de Inteligência, preencha os valores e clique nos botões de ação (ex: **"Gerar Relatório"** ou **"Calcular Créditos"**) para obter projeções em tempo real.
4. **Minigame** — Insira seu nome na tela inicial e clique em **"Dar a Partida"**. Use as setas do teclado (ou botões de toque no celular) para coletar a safra e desviar dos obstáculos. A velocidade aumenta conforme a pontuação. O Top 3 fica salvo no Ranking Local.

---

## 🎨 Design UI/UX

| Recurso | Descrição |
|---|---|
| **Responsividade** | Layout adaptável para mobile e desktop via CSS Flexbox, Grid e Media Queries |
| **Estilo visual** | Glassmorphism com variáveis de cor e estilização premium autoral |
| **Minigame** | Desenvolvido com o elemento `<canvas>` do HTML5 |
| **Mídia** | Ilustrações, fundos e ícones 3D gerados com IA (Adobe Firefly), com uso ético e declarado |

---

## 🚀 Tecnologias

Desenvolvido respeitando as diretrizes da Subcategoria 3 — exclusivamente linguagens Front-End puras, sem bibliotecas ou frameworks externos.

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 Semântico (Single Page Application) |
| Estilização | CSS3 puro (variáveis de cor, Flexbox, Grid, Media Queries) |
| Interatividade | JavaScript Vanilla (ES6+, DOM, LocalStorage, Canvas) |
| IA Generativa Visual | Adobe Firefly |

---

## 📂 Estrutura de Arquivos

```
/
├── index.html                      # Estrutura principal (Single Page Application)
├── README.md                       # Documentação do projeto
├── css/
│   └── style.css                   # Estilização, responsividade e regras visuais
├── js/
│   ├── script.js                   # Lógica dos simuladores e manipulação do DOM
│   └── minigame.js                 # Engine do jogo no Canvas e sistema de pontuação
└── img/
    ├── icone-agroviva.png          # Logotipo e favicon
    ├── hero-plataforma.jpg         # Imagem de fundo do header
    ├── fundo-agro.jpg              # Fundo secundário
    ├── icon-financeiro.png         # Ícone — Calculadora Financeira
    ├── icon-carbono.png            # Ícone — Mercado de Carbono
    ├── icon-clima.png              # Ícone — Simulador Climático
    ├── icon-estufa.png             # Ícone — Sensores de Estufa
    ├── noticia-soja.jpg            # Imagem — Notícia Mercado
    ├── noticia-tecnologia.jpg      # Imagem — Notícia Tecnologia
    └── noticia-estufa.jpg          # Imagem — Notícia Sustentabilidade
```

---

## 🤖 Transparência sobre o Uso de IA

Em total conformidade com o regulamento do Concurso Agrinho 2026, declaramos que todo o ecossistema visual deste projeto foi gerado com a ferramenta de IA generativa **Adobe Firefly**. Abaixo estão os prompts exatos utilizados na concepção de cada mídia.

<details>
<summary><strong>icone-agroviva.png</strong> — Logo Oficial</summary>

```
A professional, sophisticated, and modern flat vector logo icon on a solid white
background. Absolutely NO text, NO letters, NO words, just the symbol. The icon
represents sustainable agriculture and technology: an artistic leaf motif perfectly
integrated with abstract circuit board lines, data nodes, and connection points,
creating a dynamic sense of growth and digital innovation. The color palette includes
deep forest green, vibrant agricultural green, and radiant gold accents. Clean,
minimalist, symmetrical, and perfectly balanced corporate identity mark.
```
</details>

<details>
<summary><strong>hero-plataforma.jpg</strong> — Fundo de Entrada</summary>

```
Breathtaking wide-angle landscape of a modern Brazilian smart farm at dawn. In the
foreground, neat rows of healthy crops. In the background, sleek solar panels and a
modern agricultural drone hovering. Dark cinematic lighting, moody and professional,
lots of negative space for text overlay, photorealistic, 8k resolution.
```
</details>

<details>
<summary><strong>fundo-agro.jpg</strong> — Fundo Secundário</summary>

```
Breathtaking 8k resolution hyper-realistic landscape of a futuristic sustainable
Brazilian farm at golden hour. Lush green soy fields seamlessly integrated with sleek,
transparent solar panels. A modern white agricultural drone hovering gently in the clear
sky. Cinematic lighting, highly detailed, vibrant green and gold colors, clean
agricultural technology concept.
```
</details>

<details>
<summary><strong>icon-financeiro.png</strong> — Ícone Calculadora Financeira</summary>

```
A single, sleek, modern 3D isometric icon of a glowing digital coin and an upward
trending financial chart. Made of glossy glass and matte dark green materials with
bright gold accents. Studio lighting, pure white background, highly detailed UI UX
element, glassmorphism style, no text.
```
</details>

<details>
<summary><strong>icon-carbono.png</strong> — Ícone Mercado de Carbono</summary>

```
A single, sleek, modern 3D isometric icon of a vibrant green leaf enclosing a glowing
digital circuit network. Made of glossy glass and matte dark green materials. Studio
lighting, pure white background, highly detailed UI UX element, environmental technology
concept, glassmorphism style, no text.
```
</details>

<details>
<summary><strong>icon-clima.png</strong> — Ícone Simulador Climático</summary>

```
A single, sleek, modern 3D isometric icon of a bright sun partially covered by a
stylized cloud with digital glowing data drops falling. Made of glossy glass, bright
yellow and deep blue materials. Studio lighting, pure white background, highly detailed
UI UX element, glassmorphism style, no text.
```
</details>

<details>
<summary><strong>icon-estufa.png</strong> — Ícone Sensores Estufa</summary>

```
A single, sleek, modern 3D isometric icon of a futuristic digital thermometer gauge
glowing with neon green light. Made of glossy glass and dark metallic materials. Studio
lighting, pure white background, highly detailed UI UX element, smart farming concept,
glassmorphism style, no text.
```
</details>

<details>
<summary><strong>noticia-soja.jpg</strong> — Notícia Mercado</summary>

```
Macro photography of glowing digital holographic financial charts hovering over a
healthy green soybean sprout planted in dark, rich soil. Beautiful bokeh effect
background with a sunny farm field. High-tech agriculture, economic growth,
photorealistic, Unreal Engine 5 style.
```
</details>

<details>
<summary><strong>noticia-tecnologia.jpg</strong> — Notícia Tecnologia</summary>

```
Close-up of a futuristic glowing blue digital environmental sensor planted next to a
vibrant green corn stalk in a vast field. Tiny dew drops on the green leaves reflecting
the morning sun. Bright sunny morning, highly realistic, 8k resolution, precision
agriculture.
```
</details>

<details>
<summary><strong>noticia-estufa.jpg</strong> — Notícia Sustentabilidade</summary>

```
Inside a pristine high-tech glass agricultural greenhouse. Rows of perfectly green
hydroponic plants. Floating futuristic digital displays showing temperature and humidity
data in soft glowing neon. Natural sunlight beautifully mixed with soft purple LED grow
lights. Photorealistic, 8k, modern farming.
```
</details>

---

## 👩‍💻 Autoria

| | |
|---|---|
| **Desenvolvedor** | Miguel Pedro da Silva |
| **Orientação** | Professor Luiz Gustavo Tavares |
| **Turma** | ENS MED IF LGG/CHS ESP INT — 3ª Série — Integral A — Pensamento Computacional I |
