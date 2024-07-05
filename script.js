const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Game variables
let snake = [{x: 200, y: 200}, {x: 190, y: 200}, {x: 180, y: 200}];
let dx = 10;
let dy = 0;
let foodX;
let foodY;
let score = 0;

// Start game
main();
createFood();

document.addEventListener("keydown", changeDirection);

function main() {
    if (didGameEnd()) return;

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        // Repeat
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x, part.y, 10, 10);
        ctx.strokeRect(part.x, part.y, 10, 10);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 10;
        createFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    } else if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    } else if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    } else if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, canvasSize - 10);
    foodY = randomTen(0, canvasSize - 10);
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, 10, 10);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// Existing JavaScript code for the game...

// Add event listeners for the mode buttons
document.getElementById('lightMode').addEventListener('click', function() {
    setCanvasBackground('white');
});

document.getElementById('darkMode').addEventListener('click', function() {
    setCanvasBackground('black');
});

function setCanvasBackground(color) {
    // Set the canvas background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw the game elements on canvas after background change
    drawSnake();
    drawFood();
}

// Ensure initial canvas background is set (optional, depending on default or user preference)
setCanvasBackground('white'); // or 'black' for dark mode

