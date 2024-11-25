const cards = [
    { id: 1, img: 'sonic.png' },
    { id: 2, img: 'tails.png' },
    { id: 3, img: 'knuckles.png' },
    { id: 4, img: 'amy.png' },
    { id: 5, img: 'eggman.png' },
    { id: 6, img: 'shadow.png' },
    { id: 7, img: 'yellow-sonic.png' },
    { id: 8, img: 'zaz.png' },
];

let gameCards = [...cards, ...cards];  // Duplicando as cartas para formar os pares
let flippedCards = [];
let matchedCards = [];

// Embaralha as cartas
function shuffleCards() {
    gameCards.sort(() => Math.random() - 0.2);
}

// Cria o tabuleiro
function createBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';  // Limpa o tabuleiro antes de recriar
    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-id', card.id);
        cardElement.innerHTML = `<img src="images/${card.img}" alt="${card.img}" />`;
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });

    // Mostra as cartas por 3 segundos antes do jogo começar
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('flipped'); // Torna todas as cartas visíveis
        });
    }, 100);

    // Espera 3 segundos e esconde as imagens (fazendo as cartas virarem de volta)
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flipped'); // Vira as cartas de volta
        });
    }, 2500); // 3000 ms = 3 segundos
}

// Função para virar a carta ao ser clicada
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Verifica se as duas cartas viradas são iguais
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.getAttribute('data-id') === card2.getAttribute('data-id')) {
        playSuccessSound();  // Toca o som de sucesso de combinação
        matchedCards.push(card1, card2);
        flippedCards = [];
        if (matchedCards.length === gameCards.length) {
            setTimeout(() => {
                playVictorySound();
                showStars();
                showVictoryMessage();
            }, 500);
        }
    } else {
        playErrorSound(); // Toca som de erro
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Função para mostrar a mensagem de vitória
function showVictoryMessage() {
    const victoryMessage = document.getElementById('victory-message');
    victoryMessage.style.display = 'block';
    setTimeout(() => {
        victoryMessage.style.display = 'none';
    }, 3000);
}

// Função para mostrar estrelinhas
function showStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.style.display = 'block';

    // Cria e adiciona estrelinhas ao contêiner
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.textContent = '⭐';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.fontSize = `${Math.random() * 20 + 10}px`; // Tamanho aleatório

        starsContainer.appendChild(star);

        // Remove a estrelinha após a animação terminar
        setTimeout(() => {
            star.remove();
        }, 1000);
    }

    // Oculta as estrelinhas após um tempo
    setTimeout(() => {
        starsContainer.style.display = 'none';
    }, 2000);
}

// Função para tocar o som de vitória
function playVictorySound() {
    const victorySound = document.getElementById('victory-sound');
    victorySound.play();
}

// Função para tocar o som de erro
function playErrorSound() {
    const errorSound = document.getElementById('error-sound');
    errorSound.play();
}

// Função para tocar o som de sucesso de combinação
function playSuccessSound() {
    const successSound = document.getElementById('success-sound');
    successSound.play();
}

// Reinicia o jogo
function resetGame() {
    flippedCards = [];
    matchedCards = [];
    shuffleCards();
    createBoard();
    document.getElementById('victory-message').style.display = 'none'; // Esconde a mensagem
}

shuffleCards();
createBoard();

// Função para tocar o som de sucesso de combinação
function playSuccessSound() {
    const successSound = document.getElementById('success-sound');

    // Verificar se o áudio foi carregado corretamente
    successSound.oncanplaythrough = function () {
        successSound.play();
    };

    // Caso o áudio não tenha carregado corretamente, tentamos tocar diretamente
    successSound.onerror = function () {
        console.error('Erro ao carregar o som de sucesso');
    };

    // Tenta tocar o áudio imediatamente
    successSound.play().catch(err => {
        console.error('Erro ao tentar tocar o som:', err);
    });
}