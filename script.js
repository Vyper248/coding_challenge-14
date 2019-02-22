let allImages = ['bear', 'cat', 'cow', 'dog', 'frog', 'hamster', 'koala', 'lion', 'monkey', 'mouse', 'octopus', 'panda', 'pig', 'rabbit', 'tiger'];
let images = [...allImages.slice(0,8)];
let tempImages = [...images, ...images];
let correct = [];

let startTime = Date.now();
let timer = null;
let boardSize = 16;
let moves = 0;
let firstSelected = null;
let secondSelected = null;

const timerText = document.querySelector('#time');
const movesText = document.querySelector('#moves');
const difficulty = document.querySelector('#difficulty');
const board = document.querySelector('#board');
let tiles = document.querySelectorAll('.tile');

const startTimer = () => {
    if (timer !== null) clearInterval(timer);
    timer = setInterval(() => {
        timerText.innerText = getTimeElapsed();
    });
}

const getTimeElapsed = () => {
    let seconds = Math.floor((Date.now() - startTime) / 1000);

    if (seconds < 60) {
        if (seconds < 10) seconds = '0'+seconds;
        return seconds;
    }

    if (seconds >= 60) {
        let minutes = Math.floor(seconds/60);
        seconds = seconds % 60;
        if (seconds < 10) seconds = '0'+seconds;
        return minutes + ':' + seconds;
    }
}

const showTile = (tile) => {
    tile.querySelector('.cover').classList.add('hidden');
}

const hideTile = (tile) => {
    tile.querySelector('.cover').classList.remove('hidden');
}

const createCovers = (tile) => {
    let cover = document.createElement('div');
    cover.classList.add('cover');
    tile.appendChild(cover);
    for (let i = 0; i < 64; i++) {
        let newEl = document.createElement('div');
        newEl.classList.add('coverTile');
        cover.appendChild(newEl);
    }
}

const addImage = (tile) => {
    let rand = Math.floor(Math.random()*tempImages.length);
    let src = tempImages[rand];
    tempImages.splice(rand, 1);
    let image = document.createElement('img');
    image.classList.add('answer');
    image.setAttribute('src', 'images/'+src+'.png');
    tile.appendChild(image);
}

const compare = () => {
    let src1 = firstSelected.querySelector('img').getAttribute('src');
    let src2 = secondSelected.querySelector('img').getAttribute('src');
    if (src1 === src2) return true;
    return false;
}

const markCorrect = () => {
    firstSelected.classList.add('correct');
    secondSelected.classList.add('correct');
}

const correctGuess = () => {
    markCorrect();
    correct.push(firstSelected, secondSelected);
    firstSelected = null;
    secondSelected = null;
    moves++;
    movesText.innerText = moves;
    if (checkWon()) {
        clearInterval(timer);
    }
}

const checkWon = () => {
    let covers = document.querySelectorAll('.cover.hidden');
    if (covers.length === boardSize) return true;
    return false;
}

const badGuess = () => {
    moves++;
    movesText.innerText = moves;
    setTimeout(() => {
        hideTile(firstSelected);
        hideTile(secondSelected);
        firstSelected = null;
        secondSelected = null;
    }, 500);
}

const selectTile = (tile) => {
    if (firstSelected && secondSelected) return;
    if (correct.includes(tile)) return;
    if (!firstSelected) firstSelected = tile;
    else secondSelected = tile;
    showTile(tile);

    if (secondSelected && compare()) {
        correctGuess();
    } else if (secondSelected) {
        badGuess();
    }
}

const resetGame = () => {
    correct = [];
    startTime = Date.now();
    moves = 0;
    movesText.innerText = moves;
    startTimer();
    tempImages = [...images, ...images];
    firstSelected = null;
    secondSelected = null;
    Array.from(tiles).forEach(tile => {
        tile.classList.remove('correct');
        tile.innerHTML = '';
        createCovers(tile);
        addImage(tile);
    });
}

const generateBoard = () => {
    board.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        let newEl = document.createElement('div');
        newEl.classList.add('tile');
        board.appendChild(newEl);
    }
    tiles = document.querySelectorAll('.tile');
    Array.from(tiles).forEach(tile => {
        tile.addEventListener('click', (e) => {
            selectTile(e.target);
        });
    });
    resetGame();
}

const changeDifficulty = () => {
    let rootStyle = document.documentElement.style;
    if (difficulty.value === 'Easy'){
        boardSize = 8;
        rootStyle.setProperty('--size', 'calc(25% - 4px)');
    } else if (difficulty.value === 'Medium') {
        boardSize = 16;
        rootStyle.setProperty('--size', 'calc(25% - 4px)');
    } else if (difficulty.value === 'Hard') {
        boardSize = 30;
        rootStyle.setProperty('--size', 'calc(20% - 4px)');
    }

    images = allImages.slice(0,boardSize/2);
    generateBoard();
}