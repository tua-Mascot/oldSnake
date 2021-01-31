// Base
const canvas = document.getElementById('old-snake-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800; // 800 / 20 = 40
canvas.height = 600; // 600 / 20 = 30
const scale = 20;

// Images
const backgroundSprite = new Image();
backgroundSprite.src = '../src/img/bg.png';
const snakeSprite = new Image();
snakeSprite.src = '../src/img/s-body-pattern.png';
const foodSprite = new Image();
foodSprite.src = '../src/img/s-food.png';
const enemySprite = new Image();
enemySprite.src = '../src/img/enm.png';

// Audio
const eatA = new Audio();
eatA.src = '../src/audio/gg.mp3';
const enemyA = new Audio();
enemyA.src = '../src/audio/gg.mp3';
const ggA = new Audio();
ggA.src = '../src/audio/gg.mp3';
const bgA = new Audio();
bgA.src = '../src/audio/cp-bm-2.mp3';

// Menu + Add
let menu = {
  score: 0,
};

// Snake
let snake = [];

snake[0] = {
  speed: scale,
  x: canvas.width / 2,
  y: canvas.height / 2,
};

// Food
let food = {
  x: Math.floor(Math.random() * 38 + 1) * scale,
  y: Math.floor(Math.random() * 27 + 2) * scale,
};

// Enemy
let enemyArray = [];

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function enemyPush() {
  const x = Math.floor(Math.random() * 38 + 1) * scale;
  const y = Math.floor(Math.random() * 27 + 2) * scale;

  enemyArray.push(new Enemy(x, y));
}
setInterval(enemyPush, 3000);

// Control
let d;

document.addEventListener('keydown', direction);

function direction(event) {
  if ((event.key === 'a' || event.key == 'ArrowLeft') && d != 'RIGHT') {
    d = 'LEFT';
  } else if ((event.key == 'w' || event.key == 'ArrowUp') && d != 'DOWN') {
    d = 'UP';
  } else if ((event.key == 'd' || event.key == 'ArrowRight') && d != 'LEFT') {
    d = 'RIGHT';
  } else if ((event.key == 's' || event.key == 'ArrowDown') && d != 'UP') {
    d = 'DOWN';
  }
}

// Collision
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

// Global updates
function gUpdates() {
  document.querySelector('.eff').classList.remove('eat-eff');

  ctx.drawImage(backgroundSprite, 0, 0);
  ctx.drawImage(foodSprite, food.x + 1, food.y + 1);

  // enemy spawn
  for (let i = 0; i < enemyArray.length; i++) {
    ctx.drawImage(
      enemySprite,
      enemyArray[i].x + 1,
      enemyArray[i].y + 1,
      scale - 1,
      scale - 1
    );
  }

  // snake
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(
      snakeSprite,
      snake[i].x + 1,
      snake[i].y + 1,
      scale - 1,
      scale - 1
    );
  }

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // check direction
  if (d == 'LEFT') snakeX -= scale;
  if (d == 'UP') snakeY -= scale;
  if (d == 'RIGHT') snakeX += scale;
  if (d == 'DOWN') snakeY += scale;

  // if snake eat food
  if (snakeX == food.x && snakeY == food.y) {
    menu.score++;
    // eat.play(); TODO
    food = {
      x: Math.floor(Math.random() * 38 + 1) * scale,
      y: Math.floor(Math.random() * 27 + 2) * scale,
    };
    document.querySelector('.eff').classList.add('eat-eff');
  } else {
    // remove tail
    snake.pop();
  }

  // add new Head
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // gg
  if (
    snakeX < scale ||
    snakeX > 38 * scale ||
    snakeY < 2 * scale ||
    snakeY > 28 * scale ||
    collision(newHead, snake)
  ) {
    ggA.volume = 0.4;
    ggA.play();
    clearInterval(call);
    document.querySelector('.add__end').classList.add('unhidden');
  }

  for (var i = 0; i < enemyArray.length; i++) {
    if (enemyArray[i].x == snakeX && enemyArray[i].y == snakeY) {
      ggA.volume = 0.4;
      ggA.play();
      clearInterval(call);
      document.querySelector('.add__end').classList.add('unhidden');
    }
  }

  snake.unshift(newHead);

  // score
  ctx.fillStyle = 'white';
  ctx.font = '40px Pixeboy';
  ctx.fillText('Score: ' + menu.score, 17 * scale, 1.5 * scale);
}

//GG Menu & BG Music
document.addEventListener('keydown', addStart);
function addStart(event) {
  if (
    event.key == 'a' ||
    event.key == 'ArrowLeft' ||
    event.key == 'w' ||
    event.key == 'ArrowUp' ||
    event.key == 'd' ||
    event.key == 'ArrowRight' ||
    event.key == 's' ||
    event.key == 'ArrowDown'
  ) {
    document.querySelector('.add__start').classList.add('hidden');
    bgA.loop = true;
    bgA.volume = 0.5;
    bgA.play();
  }
}

// Call
let call = setInterval(gUpdates, 300);
