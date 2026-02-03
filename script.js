const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let level = 1;
let running = false;

let bgMusic = document.getElementById("bgMusic");

let backgrounds = {
  1: new Image(),
  2: new Image()
};

backgrounds[1].src = "assets/bg1.jpg";
backgrounds[2].src = "assets/bg2.jpg";

// Loading screen logic
window.onload = function() {
  setTimeout(() => {
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "block";
  }, 1000);
};

// Cute falling hearts effect
let hearts = [];
for (let i = 0; i < 30; i++) {
  hearts.push({
    x: Math.random() * 800,
    y: Math.random() * 400,
    size: Math.random() * 15 + 5,
    speed: Math.random() * 2 + 1
  });
}

function drawHeartsEffect() {
  hearts.forEach(h => {
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.size / 2, 0, Math.PI * 2);
    ctx.fill();
    h.y += h.speed;
    if (h.y > 400) h.y = 0;
  });
}

let dialogues = [
  "Welcome to a tiny world made just for you, Lukes 💖",
  "Use WASD to move around!",
  "Click the mouse to attack like a brave knight!",
  "Press H if you need a little heal 💕",
  "You're doing amazing ✨",
  "Almost there, hero 😌"
];

let dIndex = 0;

let player = {
  x: 60,
  y: 300,
  width: 30,
  height: 30,
  dy: 0,
  jumping: false,
  health: 3
};

let enemy = {
  x: 600,
  y: 300,
  width: 35,
  height: 35,
  health: 3,
  alive: true
};

let keys = {};
let canHeal = true;

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameUI").style.display = "block";
  canvas.style.display = "block";

  bgMusic.volume = 0.4;
  bgMusic.play();

  running = true;
  updateDialogue();
  gameLoop();
}

function updateDialogue() {
  document.getElementById("dialogueBox").innerText =
    dialogues[dIndex % dialogues.length];
  dIndex++;
}

setInterval(() => {
  if (running) updateDialogue();
}, 4500);

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

canvas.addEventListener("click", () => {
  if (enemy.alive) {
    if (player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x) {
      enemy.health--;
      if (enemy.health <= 0) enemy.alive = false;
    }
  }
});

function drawHearts() {
  document.getElementById("hearts").innerText =
    "❤️".repeat(player.health);
}

function nextLevelSetup() {
  player.x = 60;
  enemy.alive = true;
  enemy.health = level === 1 ? 3 : 5;
  canHeal = true;
}

function healPlayer() {
  if (keys["h"] && canHeal && player.health < 3) {
    player.health++;
    canHeal = false;

    setTimeout(() => {
      canHeal = true;
    }, 5000);
  }
}

function gameLoop() {
  if (!running) return;

  ctx.drawImage(backgrounds[level], 0, 0, canvas.width, canvas.height);

  drawHeartsEffect();

  if (keys["d"]) player.x += 5;
  if (keys["a"]) player.x -= 5;

  if (keys["w"] && !player.jumping) {
    player.dy = -10;
    player.jumping = true;
  }

  healPlayer();

  player.dy += 0.5;
  player.y += player.dy;

  if (player.y > 300) {
    player.y = 300;
    player.jumping = false;
  }

  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  if (enemy.alive) {
    ctx.fillStyle = level === 1 ? "#ff5c5c" : "#b84dff";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }

  if (enemy.alive &&
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x) {

    player.health--;
    player.x = 60;

    if (player.health <= 0) {
      alert("Oh no Lukes 😢 – try again, my hero!");
      location.reload();
    }
  }

  drawHearts();
  document.getElementById("levelText").innerText = "Level " + level;

  if (!enemy.alive) {
    ctx.fillStyle = "#4dff88";
    ctx.fillRect(750, 300, 30, 40);

    if (player.x > 740) {
      if (level === 1) {
        level = 2;
        alert("Level 2 unlocked! I knew you could do it 💖");
        nextLevelSetup();
      } else {
        endGame();
        return;
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

function endGame() {
  running = false;
  canvas.style.display = "none";
  document.getElementById("gameUI").style.display = "none";
  document.getElementById("endScreen").style.display = "block";
}

function playAgain() {
  location.reload();
}
