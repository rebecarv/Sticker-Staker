//Preparation

const grid = document.querySelector(".grid");
const stackBtn = document.querySelector(".stack");
const scoreCounter = document.querySelector(".score-counter");
const endGameScreen = document.querySelector(".end-game-screen");
const endGameText = document.querySelector(".end-game-text");
const playAgainBtn = document.querySelector(".play-again");

// game grid matrix
// 0 - empty cell
// 1 - bar-segment
const gridMatrix = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0], // starting currentRowIndex
];

// Variables to keep track of the game values as we play
let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;

function draw() {

  grid.innerHTML = '';

  // doing the same as: for (let i = 0; i < gridMatrix.length; i++) {}

  gridMatrix.forEach(function(rowContent) {
    rowContent.forEach(function(cellContent) {
        //Create a cell
    const cell = document.createElement('div');
    cell.classList.add('cell');

    if (cellContent === 1) {
        cell.classList.add('bar');
    }

    grid.appendChild(cell); 
    });
  });
}

//Game Logic and Controls
function endGame(isVictory) {
    if(isVictory) {
        endGameText.innerHTML = 'YOU<br>WON!'
        endGameScreen.classList.add('win');
    }

    endGameScreen.classList.remove('hidden');
}


function checkWin() {
if (currentRowIndex === 0) {
    isGameOver = true;
    clearInterval(gameInterval);
    endGame(true);
}
}


function checkLost() {
 const currentRow = gridMatrix[currentRowIndex];
 const prevRow = gridMatrix[currentRowIndex + 1];

 if(!prevRow) return;
   

//Check whether there is at least one accumulated stack element under each bar
for (let i = 0; i < currentRow.length; i++) {
  if (currentRow[i] === 1 && prevRow[i] === 0) {
    currentRow[i] = 0;
    barSize--;
  }

  if(barSize === 0) {
    isGameOver = true;
    clearInterval(gameInterval);
    endGame(false);
  }
}
}

function updateScore() {
    score += barSize;
    scoreCounter.innerText = score.toString().padStart(5, 0);
}

function onStack() {
    checkWin();
    checkLost();

    if (isGameOver) return;
    updateScore();

    currentRowIndex--;
    barDirection = 'right';

    for (let i = 0; i < barSize; i++) {
        gridMatrix[currentRowIndex][i] = 1;
    }

    draw();
}

function moveRight(currentRow) {
    //[1, 1, 1, 0, 0, 0]
    currentRow.pop(); //  [1, 1, 1, 0, 0]
    currentRow.unshift(0) //[0, 1, 1, 1, 0, 0]
}

function moveLeft(currentRow) {
    
    currentRow.shift() // [0, 0, 1, 1, 1]
    currentRow.push(0) // [0, 0, 1, 1, 1, 0]
}

function moveBar(){
 const currentRow = gridMatrix[currentRowIndex];
 console.log(currentRow);

 
 if(barDirection === 'right') {
 moveRight(currentRow);

 //[0, 0, 0, 1, 1, 1]
 const lastElement = currentRow[currentRow.length - 1]
 if(lastElement === 1) {
    barDirection = 'left';
 }

 console.log(lastElement)
 } else if (barDirection === 'left') {
   moveLeft(currentRow);

   const firstElement = currentRow[0];
   if (firstElement === 1) {
    barDirection = 'right';
   } 
 } 
}

//Initial draw on first page load
    draw();

function main() {
    moveBar()
    draw()
}

function onPlayAgain() {
    location.reload();
}

//Events

stackBtn.addEventListener('click', onStack);
playAgainBtn.addEventListener('click', onPlayAgain);
const gameInterval = setInterval(main, 300);
