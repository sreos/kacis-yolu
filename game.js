const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameSpeed = 5;
let player = { x: canvas.width / 2, y: canvas.height - 100, width: 50, height: 50, speed: 10 };
let obstacles = [];
let score = 0;
let obstacleInterval = 2000;  // Her 2 saniyede bir engel
let lastTime = 0;
let gameOver = false;

// Dokunma kontrolleri
document.addEventListener('touchstart', handleTouch);

function handleTouch(event) {
    const touchX = event.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        player.x -= player.speed;  // Sola hareket
    } else {
        player.x += player.speed;  // Sağa hareket
    }
}

// Engelleri oluştur
function createObstacle() {
    const obstacleWidth = Math.random() * (canvas.width / 2);
    obstacles.push({
        x: Math.random() * (canvas.width - obstacleWidth),
        y: 0,
        width: obstacleWidth,
        height: 20,
        speed: gameSpeed,
    });
}

// Engelleri güncelle ve çiz
function updateObstacles(deltaTime) {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;

        // Eğer engel ekranın dışına çıktıysa kaldır
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
        }

        // Çarpışma kontrolü
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

// Karakteri çiz
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Engelleri çiz
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Skor göstergesi
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 30);
}

// Oyun döngüsü
function gameLoop(timestamp) {
    if (gameOver) {
        alert('Oyun Bitti! Skor: ' + score);
        return;
    }

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    updateObstacles(deltaTime);
    drawObstacles();
    drawScore();

    if (timestamp % obstacleInterval < deltaTime) {
        createObstacle();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop(0);
