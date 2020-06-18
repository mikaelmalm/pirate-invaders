import "./style.scss";
import { defaultSettings, KEYS } from "./settings";
import {
  setDirection,
  calculateEdges,
  addSplash,
  removeSplash,
} from "./helpers";

let settings;

const checkWinCondition = () => {
  const {
    boardWidth,
    gameDisplay,
    boardSquares,
    invadersTakenDown,
    invaders,
    currentShooterIndex,
  } = settings;

  if (invadersTakenDown.length === invaders.length) {
    gameDisplay.textContent = "you win";
    clearInterval(settings.invaderId);
    addSplash();
  }

  // If invaders are touching the shooter
  if (
    boardSquares[currentShooterIndex].classList.contains("invader", "shooter")
  ) {
    gameDisplay.textContent = "Game over";
    boardSquares[currentShooterIndex].classList.add("hit");
    clearInterval(settings.invaderId);
    addSplash();
  }

  // if invaders are at the end
  settings.invaders.map((invader) => {
    if (invader > boardSquares.length - (boardWidth - 1)) {
      gameDisplay.textContent = "Game over";
      clearInterval(settings.invaderId);
      addSplash();
    }
  });
};

const moveInvaders = () => {
  const { boardWidth, boardSquares, invadersTakenDown } = settings;

  const edges = calculateEdges(settings.invaders, settings.boardWidth);
  settings.direction = setDirection(edges, settings.direction, boardWidth);

  settings.invaders = settings.invaders.map((invader) => {
    boardSquares[invader].classList.remove("invader");
    return (invader += settings.direction);
  });

  settings.invaders.map((invader) => {
    const invaderPositionInList = settings.invaders.indexOf(invader);

    if (invadersTakenDown.indexOf(invaderPositionInList) === -1) {
      boardSquares[invader].classList.add("invader");
    }
  });

  checkWinCondition();
};

const moveShooter = () => {
  const { boardSquares, boardWidth } = settings;

  boardSquares[settings.currentShooterIndex].classList.remove("shooter");

  if (
    event.keyCode === KEYS.LEFT &&
    settings.currentShooterIndex % boardWidth !== 0
  )
    settings.currentShooterIndex -= 1;
  if (
    event.keyCode === KEYS.RIGHT &&
    settings.currentShooterIndex % boardWidth < boardWidth - 1
  )
    settings.currentShooterIndex += 1;
  boardSquares[settings.currentShooterIndex].classList.add("shooter");
};

const shoot = () => {
  const { boardWidth, boardSquares } = settings;
  let currentProjectileIndex = settings.currentShooterIndex;

  const moveProjectile = () => {
    // move projectile
    boardSquares[currentProjectileIndex].classList.remove("projectile");
    currentProjectileIndex -= boardWidth;
    boardSquares[currentProjectileIndex].classList.add("projectile");

    // check if hit invader
    if (boardSquares[currentProjectileIndex].classList.contains("invader")) {
      killInvader(boardSquares[currentProjectileIndex], currentProjectileIndex);
      clearInterval(projectileId);
    }

    // If at boards end
    if (currentProjectileIndex <= boardWidth || currentProjectileIndex <= 0) {
      clearInterval(projectileId);
      setTimeout(() => {
        boardSquares[currentProjectileIndex].classList.remove("projectile");
      }, 200);
    }
  };

  // keep it going until it should stop
  let projectileId = setInterval(moveProjectile, 200);
};

const killInvader = (boardPos, projectilePos) => {
  boardPos.classList.remove("projectile");
  boardPos.classList.remove("invader");
  boardPos.classList.add("hit");

  setTimeout(() => {
    boardPos.classList.remove("hit");
  }, 200);

  settings.invadersTakenDown = [
    ...settings.invadersTakenDown,
    settings.invaders.indexOf(projectilePos),
  ];

  updateScore();
};

const updateScore = () => {
  settings.result += 1;
  settings.resultDisplay.textContent = settings.result;
};

const startGame = () => {
  const boardSquares = document.querySelectorAll(".grid div");
  const resultDisplay = document.querySelector("#scrore");
  const gameDisplay = document.querySelector("#subtitle");

  settings = { ...defaultSettings };

  settings.boardSquares = [...boardSquares];
  settings.resultDisplay = resultDisplay;
  settings.gameDisplay = gameDisplay;

  // clear board
  settings.boardSquares.map((square) => {
    square.classList.remove("shooter", "invader", "hit");
  });

  // add invaders
  settings.invaders.map((invader) =>
    boardSquares[settings.currentInvaderIndex + invader].classList.add(
      "invader"
    )
  );

  // add shooter
  boardSquares[settings.currentShooterIndex].classList.add("shooter");

  removeSplash();

  // TODO: This can be done better, restart does mess with eventListeners
  setTimeout(() => {
    document.addEventListener("keydown", () => {
      if (event.keyCode === KEYS.LEFT) moveShooter();
      if (event.keyCode === KEYS.RIGHT) moveShooter();
    });
    document.addEventListener("keyup", () => {
      if (event.keyCode === KEYS.SPACE) shoot();
    });

    settings.invaderId = setInterval(moveInvaders, 400);
  }, 250);
};

// wait until dom is loaded to enable start
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector("#start");
  startBtn.addEventListener("click", () => startGame());
});
