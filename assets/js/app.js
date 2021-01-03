/**
 * VARIABLES DE NOTRE JEU, certaines pourraient être choisies par le joueur ?
 */

//le terrain de jeu
const gameBoard = document.getElementById("gameBoard");

//notre joueur, une div
const player = document.createElement("div");

//le tableau des ennemis et son nombre
const ennemies = [];
const nbEnnemies = 10;

//le tableau des directions, servira plus tard, les noms écris ici servant surtout à être "plus parlant"
const directions = ["up", "down", "left", "right"];

//nb de vies et la span où les faire apparaître
let lives = 100;
const livesSpan = document.getElementById("nbLives");

//afficher les nombre de vies
function displayLives() {
  livesSpan.innerText = lives;
}

//pour savoir si notre perso a des frames d'invulnérabilité ou non
let invincible = false;

//textes de fin, gagné ou perdu
const textGameOver = "GAME OVER";
const textWin = "YOU WIN !";

let endgame = false;

/**
 * INITIALISATION DU JEU
 */

//On affiche les vies au début du jeu
displayLives();

//On créé notre personnage, un carré jaune (voir CSS #player)
player.setAttribute("id", "player");
gameBoard.appendChild(player);

//On créé nos ennemis, on peut faire appeler notre fonction en avance grâce au hoisiting
createEnnemies();

/**
 * FONCTIONS POUR GÉRER LE JEU
 */

//nous allons beaucoup utiliser cet enchaînement de fonction (parseInt) et méthodes JS (getComputedStyle, getPropertyValue), du coup nous créons une fonction pour que l'écriture de cela soit plus rapide ; cette fonction va nous servir pour détecter les collisions et déplacer notre personnage et ennemis
function getComputedStyleInt(element, property) {
  return parseInt(
    window.getComputedStyle(element).getPropertyValue(property),
    10
  );
}

//fonction qui créé des positions aléatoires pour les ennemis avec des contraintes (while, if, for)
function randomPosEnnemies() {
  const positions = [];
  let x;
  let y;
  while (positions.length < nbEnnemies) {
    //on  créé des valeurs aléatoires pour une position sur l'axe x et y qui ont des valeurs multiples de 50, soit la longueur et largeur de nos éléments, et qui sont adaptés à la taille de notre plateau de jeu
    x = Math.floor(Math.random() * 15) * 50;
    y = Math.floor(Math.random() * 15) * 50;
    //si ces valeurs ne sont pas trop proches du centre, soit la zone où se trouve notre personnage
    if (!(x >= 250 && x <= 450) && !(y >= 250 && y <= 450)) {
      let add = true;
      for (let i = 0; i < positions.length; i++) {
        //si cette position existe déjà dans notre tableau de positions, càd qu'un ennemi a déjà cette position
        if (positions[i][0] === x && positions[i][1] === y) {
          //on empêche le fait de rajouter cette position dans notre tableau de position
          add = false;
        }
      }
      //si on a respecté toutes les conditions ==> add = true
      if (add) {
        positions.push([x, y]);
      }
    }
  }
  return positions;
}

//créer les ennemies avec les contraintes issues de la fonction randomPosEnnemies
function createEnnemies() {
  const positions = randomPosEnnemies();
  for (let i = 0; i < nbEnnemies; i++) {
    ennemies[i] = document.createElement("div");
    ennemies[i].setAttribute("class", "ennemi");
    ennemies[i].style.top = positions[i][0] + "px";
    ennemies[i].style.left = positions[i][1] + "px";
    gameBoard.appendChild(ennemies[i]);
  }
}

//fonction pour afficher l'état du jeu (win or lose)
function displayGameStatus(className, textToDisplay) {
  const text = document.createElement("h2");
  text.setAttribute("class", className);
  text.innerText = textToDisplay;
  gameBoard.appendChild(text);
  endgame = true;
}

//fonction pour signaler au joueur qu'il a gagné
function win() {
  displayGameStatus("win", textWin);
}

//fonction pour signaler au joueur qu'il a perdu
function gameOver() {
  gameBoard.removeChild(player);
  displayGameStatus("gameover", textGameOver);
}

//fonction qui check les vies de notre personnage
function checkLifeHero() {
  lives--;
  displayLives();
  player.classList.add("touched");
  invincible = true;
  setTimeout(() => {
    player.classList.remove("touched");
    invincible = false;
  }, 3000);
  if (lives <= 0) {
    gameOver();
  }
}

//fonction qui détecte si les ennemis touchent notre personnage
function detectionPlayerEnnemies() {
  let playerTop = getComputedStyleInt(player, "top");
  let playerLeft = getComputedStyleInt(player, "left");

  //Si notre personnage n'est pas invincible
  if (!invincible) {
    //On vérifie pour chaques ennemis
    for (let i = 0; i < ennemies.length; i++) {
      let ennemiTop = getComputedStyleInt(ennemies[i], "top");
      let ennemiLeft = getComputedStyleInt(ennemies[i], "left");

      if (ennemiTop === playerTop && ennemiLeft === playerLeft) {
        checkLifeHero();
      }
    }
  }
}

//fonction qui sert à détecter une collision entre l'explosion et notre personnage et les ennemis
function detectionExplosion(bomb) {
  let bombTop = getComputedStyleInt(bomb, "top");
  let bombLeft = getComputedStyleInt(bomb, "left");
  let playerTop = getComputedStyleInt(player, "top");
  let playerLeft = getComputedStyleInt(player, "left");
  console.log(ennemies);
  //on vérifie pour chaque ennemi s'il est dans le périmètre de la bombe
  for (let i = 0; i < ennemies.length; i++) {
    let ennemiTop = getComputedStyleInt(ennemies[i], "top");

    let ennemiLeft = getComputedStyleInt(ennemies[i], "left");

    if (
      ennemiTop >= bombTop &&
      ennemiTop <= bombTop + 100 &&
      ennemiLeft >= bombLeft &&
      ennemiLeft <= bombLeft + 100 &&
      !endgame
    ) {
      gameBoard.removeChild(ennemies[i]);
      ennemies.splice(i, 1);
      console.log(ennemies);
      if (ennemies.length <= 0) {
        win();
      }
    }
  }

  if (!invincible && !endgame) {
    if (
      playerTop >= bombTop &&
      playerTop <= bombTop + 100 &&
      playerLeft >= bombLeft &&
      playerLeft <= bombLeft + 100
    ) {
      checkLifeHero();
    }
  }

  setTimeout(() => {
    gameBoard.removeChild(bomb);
  }, 300);
}

//fonction qui sert à créer une explosion
function createExplosion(bomb) {
  //explosion.setAttribute("class", "explosion");
  bomb.classList.add("explosion");
  bomb.classList.remove("bomb");
  bomb.style.top = parseInt(bomb.style.top) - 50 + "px";
  bomb.style.left = parseInt(bomb.style.left) - 50 + "px";
  detectionExplosion(bomb);
}

//fonction qui sert à créer une bombe
function createBomb(top, left) {
  let bomb = document.createElement("div");
  bomb.setAttribute("class", "bomb");
  bomb.style.top = top + "px";
  bomb.style.left = left + "px";
  gameBoard.appendChild(bomb);
  setTimeout(() => {
    createExplosion(bomb);
  }, 3000);
}

//fonction qui gère les déplacements de notre peronnage et des ennemis car ils se déplacent à peu près de la même façon !
function move(element, direction) {
  let topElement = getComputedStyleInt(element, "top");
  let leftElement = getComputedStyleInt(element, "left");

  switch (direction) {
    case "up":
      if (topElement > 0) {
        element.style.top = topElement - 50 + "px";
      }
      break;

    case "down":
      if (topElement < 700) {
        element.style.top = topElement + 50 + "px";
      }
      break;

    case "left":
      if (leftElement > 0) {
        element.style.left = leftElement - 50 + "px";
      }
      break;

    case "right":
      if (leftElement < 700) {
        element.style.left = leftElement + 50 + "px";
      }
      break;
  }
  detectionPlayerEnnemies();
}

/**
 * LES ÉLÉMENTS À VÉRIFIER/FAIRE EN "PERMANENCE" ==> addEventListener + setInterval
 */

//on check les interactions de notre utilisateur sur les touches prévues pour cela, encore un famoso addEventListener
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowUp") {
    move(player, "up");
  } else if (e.key === "ArrowDown") {
    move(player, "down");
  } else if (e.key === "ArrowLeft") {
    move(player, "left");
  } else if (e.key === "ArrowRight") {
    move(player, "right");
  } else if (e.key === " " && !endgame) {
    createBomb(
      getComputedStyleInt(player, "top"),
      getComputedStyleInt(player, "left")
    );
  } else if (e.key === "0") {
    //version lazy pour faire une nouvelle partie
    location.reload();
  }
});

//faire bouger les ennemis toutes les secondes
setInterval(function () {
  for (let i = 0; i < ennemies.length; i++) {
    let random = Math.floor(Math.random() * 4);
    move(ennemies[i], directions[random]);
  }
}, 1000);
