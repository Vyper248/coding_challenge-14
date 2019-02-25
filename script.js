let allImages = ['angular', 'cplusplus', 'csharp', 'css', 'html', 'java', 'js', 'mongodb', 'nodejs', 'passport', 'php', 'python', 'react', 'ruby', 'sequelize'];
let images = [...allImages.slice(0,8)];
let tempImages = [...images, ...images];
let correct = [];

let startTime = Date.now();
let timer = null;
let boardSize = 16;
let moves = 0;
let firstSelected = null;
let secondSelected = null;
let score = 1000;
let seconds = 0;
let difficulty = 'Medium';
let leaderboardDifficulty = 'Medium';

const timerText = document.querySelector('#time');
const movesText = document.querySelector('#moves');
const scoreText = document.querySelector('#score');

const finalTime = document.querySelector('#finalTime');
const finalMoves = document.querySelector('#finalMoves');
const finalScore = document.querySelector('#finalScore');

const leaderboard = document.querySelector('#leaderboard');
const leaderboardScores = document.querySelector('#leaderboardScores');

const board = document.querySelector('#board');
const gameOver = document.querySelector('#gameOver');
let tiles = document.querySelectorAll('.tile');

const startTimer = () => {
    if (timer !== null) clearInterval(timer);
    startTime = Date.now();
    updateTime();
    timer = setInterval(() => {
        updateTime();
        score--;
        updateScore();
    }, 1000);
}

const getTimeElapsed = () => {
    let seconds = Math.floor((Date.now() - startTime) / 1000);
    return parseTime(seconds);
}

const parseTime = (seconds) => {
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

const updateTime = () => {
    timerText.innerText = getTimeElapsed();
    finalTime.innerText = getTimeElapsed();
}

const updateScore = () => {
    if (score < 0) score = 0;
    scoreText.innerHTML = 'Score<br>' + score;
    finalScore.innerText = score;
}

const updateMoves = () => {
    movesText.innerText = moves;
    finalMoves.innerText = moves;
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
    image.classList.add('image');
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
    updateMoves();
    if (checkWon()) {
        endGame();
    }
}

const checkWon = () => {
    let covers = document.querySelectorAll('.cover.hidden');
    if (covers.length === boardSize) return true;
    return false;
}

const badGuess = () => {
    moves++;
    score -= 5;
    updateScore();
    updateMoves();
    setTimeout(() => {
        hideTile(firstSelected);
        hideTile(secondSelected);
        firstSelected = null;
        secondSelected = null;
    }, 500);
}

const selectTile = (tile) => {
    if (tile === firstSelected) return;
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

const endGame = () => {
    clearInterval(timer);
    seconds = Math.floor((Date.now() - startTime) / 1000);
    gameOver.classList.add('open');
}

const openLeaderboard = () => {
    getScores();
    leaderboard.classList.add('open');
}

const closePopup = (el) => {
    el.parentNode.classList.remove('open');
}

const closeAllPopups = () => {
    gameOver.classList.remove('open');
}

const submitScore = () => {
    let username = document.querySelector('#usernameInput').value;
    fetch('http://localhost:3010/leaderboard', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({username, seconds, score, moves, difficulty: difficulty})
    }).then(resp => resp.json()).then(data => {
        closeAllPopups();
        document.querySelector('#usernameInput').value = '';
    });
}

const getScores = () => {
    fetch('http://localhost:3010/leaderboard/'+leaderboardDifficulty).then(resp => resp.json()).then(data => {
        populateLeadboard(data);
    });
}

const populateLeadboard = (data) => {
    leaderboardScores.innerText = '';
    data.forEach(scoreObj => {
        let row = document.createElement('tr');
        row.appendChild(createTD(scoreObj.username));
        row.appendChild(createTD(parseTime(scoreObj.seconds)));
        row.appendChild(createTD(scoreObj.moves));
        row.appendChild(createTD(scoreObj.score));
        leaderboardScores.appendChild(row);
    });
}

const createTD = (value) => {
    let td = document.createElement('td');
    td.innerText = value;
    return td;
};

const resetGame = () => {
    correct = [];
    startTime = Date.now();
    closeAllPopups();
    moves = 0;
    score = 1000;
    updateScore();
    updateMoves();
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

const changeDifficulty = (el) => {
    let rootStyle = document.documentElement.style;
    if (el.value === 'Easy'){
        boardSize = 8;
        rootStyle.setProperty('--size', 'calc(25% - 4px)');
    } else if (el.value === 'Medium') {
        boardSize = 16;
        rootStyle.setProperty('--size', 'calc(25% - 4px)');
    } else if (el.value === 'Hard') {
        boardSize = 30;
        rootStyle.setProperty('--size', 'calc(20% - 4px)');
    }
    
    difficulty = el.value;
    getScores();
    images = allImages.slice(0,boardSize/2);
    generateBoard();
}

const changeLeaderboardDifficulty = (el) => {
    leaderboardDifficulty = el.value;
    getScores();
}