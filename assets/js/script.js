// Seleciona todas as cartas.
const cards = document.querySelectorAll(".card");
const timerDisplay = document.querySelector("#timer");
const recordDisplay = document.querySelector("#record");
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let timerInterval = null;
let startTime = null;
// O recorde dura só enquanto a página está aberta.
let bestTime = null;

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);
}

function finishGame() {
    clearInterval(timerInterval);
    timerInterval = null;

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = formatTime(elapsedSeconds);

    if (bestTime === null || elapsedSeconds < bestTime) {
        bestTime = elapsedSeconds;
        recordDisplay.textContent = formatTime(bestTime);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;
    timerDisplay.textContent = "00:00";
}

// Inicia a comparação das cartas.
function flipCard(event) {
    // Usa a carta que recebeu o clique.
    const clickedCard = event.currentTarget;
    if(cardOne !== clickedCard && !disableDeck) {
        if(startTime === null) startTimer();
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}
// Compara as duas imagens.
function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched === 8) {
            finishGame();
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        // Marca as cartas que não combinam.
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}
// Embaralha e reinicia as cartas.
function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    resetTimer();
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `assets/img/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}
// Começa a primeira rodada.
shuffleCard();
// Ativa o clique em cada carta.
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});
