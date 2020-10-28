//le joueur
const player = document.getElementById("player");
//le plateau de jeu
const gameBoard = document.getElementById("gameboard");
//est-ce que le joueur est touché ou non, par déafut à false
let isTouched = false;
//nombre de vies de notre personnage
let lives = 3;
//nombre d'ennemis
const nbEnnemies = 10;
//tableau qui va contenir nos ennemis (des divs)
const ennemies = [];

//fonction pour générer des positions initiales aléatoires à nos ennemis
function generateRandomPositions() {
  //tableau qui va contenir nos différentes positions aléatoires initiales
  const randomPositions = [];
  //tant que ce tableau ne fait pas la taille du nombre d'ennemis définis
  while (randomPositions.length < nbEnnemies) {
    //on  créé des valeurs aléatoires pour une position sur l'axe x et y qui ont des valeurs multiples de 50, soit la longueur et largeur de nos éléments, et qui sont adaptés à la taille de notre plateau de jeu
    x = Math.floor(Math.random() * 15) * 50 + 25; //+25 à cause du border du plateau de jeu
    y = Math.floor(Math.random() * 15) * 50 + 25; //+25 à cause du border du plateau de jeu
    //si ces valeurs ne sont pas trop proches du centre, soit la zone où se trouve notre personnage
    if (!(x >= 250 && x <= 450) && !(y >= 250 && y <= 450)) {
      //un booléen représentant si l'on peut ajouter le duo x, y dans notre tableau de positions
      let add = true;
      //on parcours notre tableau de positions aléatoire
      for (let j = 0; j < randomPositions.length; j++) {
        //si cette position existe déjà dans notre tableau de positions, càd qu'un ennemi a déjà cette position
        if (randomPositions[j][0] === x && randomPositions[j][1] === y) {
          //on empêche le fait de rajouter cette position dans notre tableau de position
          add = false;
        }
      }
      //si on a respecté toutes les conditions ==> add = true
      if (add) {
        //on ajoute le duo x, y dans notre tableau, ce qui incrémente pour notre boucle while
        randomPositions.push([x, y]);
      }
    }
  }
  //on retourne le tableau de positions aléatoires
  return randomPositions;
}

//fonction pour créer les ennemis
function createEnnemies() {
  //on récupère les positions aléatoires grâce à la fonction generateRandomPositions()
  const positions = generateRandomPositions();
  //pour le nombre d'ennemis que l'on souhaite
  for (let i = 0; i < nbEnnemies; i++) {
    //on créé une div
    ennemies[i] = document.createElement("div");
    //on lui ajoute la classe ennemi
    ennemies[i].setAttribute("class", "ennemi");
    //on lui donne un style inline pour son top
    ennemies[i].style.top = positions[i][0] + "px";
    //on lui donne un style inline pour son left
    ennemies[i].style.left = positions[i][1] + "px";
    //on ajoute l'ennemi au plateau de jeu
    gameBoard.appendChild(ennemies[i]);
  }
}

//on appelle la fonction pour créer les ennemis au chargement de la page
createEnnemies();

//fonction pour récupérer plus rapidement les valeurs calculées des propriétés CSS des éléments
function getStyleValue(element, property) {
  return parseInt(window.getComputedStyle(element).getPropertyValue(property));
}

//fonction pour détecter si une explosion touche un élément de notre plateau de jeu
function detecteExplosion(explosion) {
  //on rédupère le top de notre explosion
  let explosionTop = getStyleValue(explosion, "top");
  //on rédupère le left de notre explosion
  let explosionLeft = getStyleValue(explosion, "left");
  //on rédupère le top de notre joueur
  let playerTop = getStyleValue(player, "top");
  //on rédupère le left de notre joueur
  let playerLeft = getStyleValue(player, "left");
  //si notre joueur est dans l'explosion et n'est pas dans des frames d'invulnérabilité (soit isTouched à true)
  if (
    playerTop >= explosionTop - 50 &&
    playerTop <= explosionTop + 50 &&
    playerLeft >= explosionLeft - 50 &&
    playerLeft <= explosionLeft + 50 &&
    !isTouched
  ) {
    //on diminue son nombre de vie
    lives--;
    //on passe le fait que le joueur soit touché à vrai
    isTouched = true;
    player.classList.add("touched");
    setTimeout(function () {
      isTouched = false;
      player.classList.remove("touched");
    }, 3000);
  }
  //On parcours le tableau d'ennemis dans le sens inverse, cela est recommandé lorsque l'on désire retirer un élément d'un tableau au fur et à mesure qu'on le parcours
  for (let i = ennemies.length - 1; i >= 0; i--) {
    let ennemiTop = getStyleValue(ennemies[i], "top");
    let ennemiLeft = getStyleValue(ennemies[i], "left");
    console.log(`ennemi top = ${ennemiTop} left = ${ennemiLeft}`);
    console.log(`bombe top = ${explosionTop} left = ${explosionLeft}`);
    if (
      ennemiTop >= explosionTop - 50 &&
      ennemiTop <= explosionTop + 50 &&
      ennemiLeft >= explosionLeft - 50 &&
      ennemiLeft <= explosionLeft + 50
    ) {
      gameBoard.removeChild(ennemies[i]);
      ennemies.splice(i, 1);
    }
  }
}

//fonction pour créer une explosion
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

//fonction pour créer une bombe
function createBomb(playerTop, playerLeft) {
  //on créé un élément div
  let bomb = document.createElement("div");
  //on lui ajoute la classe bomb
  bomb.setAttribute("class", "bomb");
  //on défini son top par rapport à celui du joueur
  bomb.style.top = `${playerTop}px`;
  //on défini son left par rapport à celui du joueur
  bomb.style.left = `${playerLeft}px`;
  //on ajoute la div dans notre plateau de jeu
  gameBoard.appendChild(bomb);
  //au bout de 3s
  setTimeout(function () {
    //on enlève la bombe du plateau de jeu  
    bomb.remove();
    //on créé une explosion à la position souhaitée soit celle du joueur lorsqu'il a placé la bombe
    createExplosion(playerTop, playerLeft);
  }, 3000);
}

//On écoute si l'utilisateur appuie sur des touches de son clavier
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
