const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname');

// Display the nickname in the "display" div
const displayDiv = document.getElementById('display');
displayDiv.textContent = `Hi ${nickname}`;

// board
var blocksize = 25; // size of each box in the board
// no of boxes in the board row and column-wise
var rows = 20;
var cols = 20;
var board;
var context; // for the drawing width of our drawing object

// snake head
var snakeX = blocksize * 0;
var snakeY = blocksize * 0;
var snakeRadius = blocksize / 2;
var velocityX = 0;
var velocityY = 0;

// snake body
var snakeBody = [];

// snake food
var foodX;
var foodY;

// game over
var gameOver = false;

// Sound effects
var eatSound = new Audio("./foodEatingSound.mp3");
var gameOverSound = new Audio('./GameOver.mp3');

// Score
var points = 0;

window.onload = function() {
  board = document.getElementById("board");
  board.height = rows * blocksize;
  board.width = cols * blocksize;
  context = board.getContext("2d"); // used for drawing on the board

  placefood();
  document.addEventListener("keyup", changeDirection);
  setInterval(update, 1000 / 10); // 100 milliseconds
};

function update() {
  if (gameOver) {
    return;
  }
  context.fillStyle = "rgb(98, 8, 90)";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = "red";
  context.beginPath();
  context.arc(
    foodX + snakeRadius,
    foodY + snakeRadius,
    snakeRadius,
    0,
    2 * Math.PI
  );
  context.fill();

  if (snakeX == foodX && snakeY == foodY) {
    eatSound.currentTime = 0;
    eatSound.play();
    snakeBody.push([foodX, foodY]);
    placefood();
    points++; // Increase points
    document.getElementById("scoreBoard").textContent = "Points :"+points; // Update the points in the scoreBoard div
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  const gradient = context.createLinearGradient(
    snakeX,
    snakeY,
    snakeX + snakeRadius * 2,
    snakeY + snakeRadius * 2
  );
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, "green");
  context.fillStyle = gradient;

  snakeX += velocityX * (blocksize / 2);
  snakeY += velocityY * (blocksize / 2);
  context.beginPath();
  context.arc(
    snakeX + snakeRadius,
    snakeY + snakeRadius,
    snakeRadius,
    0,
    2 * Math.PI
  );
  context.fill();
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blocksize, blocksize);
  }

  if (
    snakeX < 0 ||
    snakeX > cols * blocksize ||
    snakeY < 0 ||
    snakeY > rows * blocksize
  ) {
    gameOver = true;
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    alert("Game Over"+"\nYour Points : " + points);
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      gameOver = true;
      gameOverSound.currentTime = 0;
      gameOverSound.play();
      alert("Game Over"+"Your Points : " + points);
    }
  }
}

function changeDirection(e) {
  if (e.code == "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code == "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code == "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.code == "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  }
}
  
function placefood() {
  foodX = Math.floor(Math.random() * cols) * blocksize;
  foodY = Math.floor(Math.random() * rows) * blocksize;
}
