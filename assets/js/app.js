const player = document.getElementById("player");
const gameBoard = document.getElementById("gameboard");
let isTouched = false;
let lives = 3;
const ennemies = [];

function generateRandomEnnemies() {
    while(ennemies.length < 6) {
        let x = Math.floor(Math.random() * (650 - 25 + 1)) + 25;
        let y = Math.floor(Math.random() * (650 - 25 + 1)) + 25;
        console.log(`x = ${x} et y = ${y}`);
        ennemies.push([x, y]);
    }
    console.log(ennemies);
}

generateRandomEnnemies();

function getStyleValue(element, property) {
  return parseInt(window.getComputedStyle(element).getPropertyValue(property));
}

function detecteExplosion(explosion) {
  let explosionTop = getStyleValue(explosion, "top");
  let explosionLeft = getStyleValue(explosion, "left");
  let playerTop = getStyleValue(player, "top");
  let playerLeft = getStyleValue(player, "left");
  if (
    playerTop >= explosionTop - 50 &&
    playerTop <= explosionTop + 50 &&
    playerLeft >= explosionLeft - 50 &&
    playerLeft <= explosionLeft + 50 &&
    !isTouched
  ) {
    lives--;
    isTouched = true;
    player.classList.add("touched");
    setTimeout(function() {
        isTouched = false;
        player.classList.remove("touched");
    }, 3000);
  }
}

function createExplosion(bombTop, bombLeft) {
  let explosion = document.createElement("div");
  explosion.setAttribute("class", "explosion");
  explosion.style.top = `${bombTop}px`;
  explosion.style.left = `${bombLeft}px`;
  gameBoard.appendChild(explosion);
  setTimeout(function () {
    detecteExplosion(explosion);
    explosion.remove();
  }, 300);
}

function createBomb(playerTop, playerLeft) {
  let bomb = document.createElement("div");
  bomb.setAttribute("class", "bomb");
  bomb.style.top = `${playerTop}px`;
  bomb.style.left = `${playerLeft}px`;
  gameBoard.appendChild(bomb);
  setTimeout(function () {
    bomb.remove();
    createExplosion(playerTop, playerLeft);
  }, 3000);
}

document.addEventListener("keydown", (e) => {
  let left = getStyleValue(player, "left");
  let top = getStyleValue(player, "top");
  switch (e.code) {
    case "ArrowRight":
      if (left < 700) {
        left += 50;
        player.style.left = `${left}px`;
      }
      break;
    case "ArrowLeft":
      if (left > 25) {
        left -= 50;
        player.style.left = `${left}px`;
      }
      break;
    case "ArrowUp":
      if (top > 25) {
        top -= 50;
        player.style.top = `${top}px`;
      }
      break;
    case "ArrowDown":
      if (top <= 700) {
        top += 50;
        player.style.top = `${top}px`;
      }
      break;
    case "Space":
      createBomb(top, left);
    default:
      break;
  }
});
