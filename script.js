const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let gameSpeed = 100;

let snake = [
    { x: 100, y: 50 },
    { x: 90, y: 50 },
    { x: 80, y: 50 }
];
let dx = gridSize; // Initial movement: right
let dy = 0;
let food = getRandomFoodPosition();
let score = 0;
let changingDirection = false; // Prevent rapid direction changes
let gameInterval;

function getRandomFoodPosition() {
    let newFoodPosition;
    while (true) {
        newFoodPosition = {
            x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize
        };
        // Ensure food doesn't spawn on the snake
        let collision = snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y);
        if (!collision) {
            return newFoodPosition;
        }
    }
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = "green";
    ctx.strokeStyle = "darkgreen";
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "lightgray";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 1;
        scoreElement.textContent = score;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    // Wall collision
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvasWidth;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvasHeight;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        return true;
    }

    // Self collision
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const W_KEY = 87;
    const A_KEY = 65;
    const S_KEY = 83;
    const D_KEY = 68;

    const keyPressed = event.keyCode;

    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
    if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}

function gameOver() {
    clearInterval(gameInterval);
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent black overlay
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "90px 'Times New Roman'";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("YOU DIED", canvasWidth / 2, canvasHeight / 4 + 30);

    ctx.font = "20px 'Consolas'";
    ctx.fillStyle = "white";
    ctx.fillText(`Final Score: ${score}`, canvasWidth / 2, canvasHeight / 1.25);

    // Optional: Add a restart message/button later
}

function gameLoop() {
    changingDirection = false; // Allow direction change for next frame
    if (checkCollision()) {
        gameOver();
        return;
    }

    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawFood();
    moveSnake();
    drawSnake();
}

document.addEventListener("keydown", changeDirection);

// Start game
gameInterval = setInterval(gameLoop, gameSpeed);

