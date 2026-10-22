const formas = [
  { id: "circle", nome: "Círculo" },
  { id: "square", nome: "Quadrado" },
  { id: "triangle", nome: "Triângulo" },
  { id: "star", nome: "Estrela" },
  { id: "hexagon", nome: "Hexágono" },
  { id: "diamond", nome: "Losango" },
  { id: "heart", nome: "Coração" },
  { id: "crescent", nome: "Lua crescente" },
];
const tabuleiro = document.querySelector("#board");
const jogadasTexto = document.querySelector("#moves");
const paresTexto = document.querySelector("#pairs");
const tempoTexto = document.querySelector("#timer");
const statusTexto = document.querySelector("#status");
const botaoNovoJogo = document.querySelector("#restart");
let primeiraCarta = null;
let cartasAbertas = [];
let jogadas = 0;
let paresEncontrados = 0;
let bloqueado = false;
let inicio = null;
let intervaloDoRelogio = null;
let atrasoParaFechar = null;
function embaralhar(lista) {
  const cartas = [...lista];
  for (let indice = cartas.length - 1; indice > 0; indice -= 1) {
    const sorteado = Math.floor(Math.random() * (indice + 1));
    [cartas[indice], cartas[sorteado]] = [cartas[sorteado], cartas[indice]];
  }
  return cartas;
}
// Carrega a imagem transparente da forma.
function criarIcone(nome) {
  const imagem = document.createElement("img");
  imagem.classList.add("card__icon");
  imagem.src = `/imagens/${nome}.png`;
  imagem.alt = "";
  imagem.draggable = false;
  imagem.setAttribute("aria-hidden", "true");
  return imagem;
}
function criarLadoDaCarta(tipo, forma) {
  const lado = document.createElement("span");
  lado.classList.add("card__side", `card__side--${tipo}`);
  lado.setAttribute("aria-hidden", "true");
  lado.append(criarIcone(tipo === "back" ? "question-mark" : forma.id));
  return lado;
}
// Monta cada carta com elementos criados pelo DOM.
function criarCarta(forma) {
  const carta = document.createElement("button");
  const interior = document.createElement("span");
  carta.type = "button";
  carta.classList.add("card");
  carta.dataset.forma = forma.id;
  carta.setAttribute("aria-label", "Carta fechada");
  interior.classList.add("card__inner");
  interior.append(criarLadoDaCarta("back", forma), criarLadoDaCarta("front", forma));
  carta.append(interior);
  return carta;
}
function atualizarRelogio() {
  if (inicio === null) return;
  const segundos = Math.floor((Date.now() - inicio) / 1000);
  const minutos = Math.floor(segundos / 60).toString().padStart(2, "0");
  const resto = (segundos % 60).toString().padStart(2, "0");
  tempoTexto.textContent = `${minutos}:${resto}`;
}
function iniciarRelogio() {
  if (inicio !== null) return;
  inicio = Date.now();
  intervaloDoRelogio = window.setInterval(atualizarRelogio, 1000);
}
function fecharCartasAbertas() {
  cartasAbertas.forEach((carta) => {
    carta.classList.remove("is-open");
    carta.setAttribute("aria-label", "Carta fechada");
  });
  cartasAbertas = [];
  primeiraCarta = null;
  bloqueado = false;
  atrasoParaFechar = null;
  statusTexto.textContent = "Tente encontrar outro par.";
}
function marcarParEncontrado() {
  cartasAbertas.forEach((carta) => {
    carta.classList.add("is-matched");
    carta.disabled = true;
    carta.setAttribute("aria-label", `Par de ${primeiraCarta.nome} encontrado`);
  });
  paresEncontrados += 1;
  paresTexto.textContent = paresEncontrados.toString();
  cartasAbertas = [];
  primeiraCarta = null;
  if (paresEncontrados === formas.length) {
    window.clearInterval(intervaloDoRelogio);
    statusTexto.textContent = `Você venceu em ${jogadas} jogadas e ${tempoTexto.textContent}.`;
    statusTexto.classList.add("is-complete");
  } else {
    statusTexto.textContent = "Par encontrado!";
  }
}
// Abre a carta e compara com a primeira seleção.
function virarCarta(carta) {
  if (bloqueado || carta.disabled || carta.classList.contains("is-open")) return;
  iniciarRelogio();
  carta.classList.add("is-open");
  carta.setAttribute("aria-label", carta.dataset.nome);
  cartasAbertas.push(carta);
  if (cartasAbertas.length === 1) {
    primeiraCarta = {
      id: carta.dataset.forma,
      nome: carta.dataset.nome,
    };
    statusTexto.textContent = "Agora escolha outra carta.";
    return;
  }
  jogadas += 1;
  jogadasTexto.textContent = jogadas.toString();
  if (carta.dataset.forma === primeiraCarta.id) {
    marcarParEncontrado();
    return;
  }
  bloqueado = true;
  statusTexto.textContent = "As formas não são iguais.";
  atrasoParaFechar = window.setTimeout(fecharCartasAbertas, 850);
}
function iniciarJogo() {
  window.clearInterval(intervaloDoRelogio);
  window.clearTimeout(atrasoParaFechar);
  primeiraCarta = null;
  cartasAbertas = [];
  jogadas = 0;
  paresEncontrados = 0;
  bloqueado = false;
  inicio = null;
  jogadasTexto.textContent = "0";
  paresTexto.textContent = "0";
  tempoTexto.textContent = "00:00";
  statusTexto.textContent = "Escolha uma carta para começar.";
  statusTexto.classList.remove("is-complete");
  const baralho = embaralhar([...formas, ...formas]);
  const cartas = baralho.map((forma) => {
    const carta = criarCarta(forma);
    carta.dataset.nome = forma.nome;
    return carta;
  });
  // Troca todas as cartas do tabuleiro de uma vez.
  tabuleiro.replaceChildren(...cartas);
}
// Um único evento no tabuleiro identifica a carta clicada.
tabuleiro.addEventListener("click", (evento) => {
  const carta = evento.target.closest(".card");
  if (!carta || !tabuleiro.contains(carta)) return;
  virarCarta(carta);
});
botaoNovoJogo.addEventListener("click", iniciarJogo);
iniciarJogo();