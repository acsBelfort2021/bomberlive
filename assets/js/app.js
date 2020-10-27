const player = document.getElementById("player");
const gameBoard = document.getElementById("gameboard");

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
    playerLeft <= explosionLeft + 50
  ) {
    console.log("touché");
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
      if (left <= 650) {
        left += 25;
        player.style.left = `${left}px`;
      }
      break;
    case "ArrowLeft":
      if (left > 25) {
        left -= 25;
        player.style.left = `${left}px`;
      }
      break;
    case "ArrowUp":
      if (top > 25) {
        top -= 25;
        player.style.top = `${top}px`;
      }
      break;
    case "ArrowDown":
      if (top <= 650) {
        top += 25;
        player.style.top = `${top}px`;
      }
      break;
    case "Space":
      createBomb(top, left);
    default:
      break;
  }
});
