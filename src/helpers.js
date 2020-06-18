export const calculateEdges = (invaders, boardWidth) => {
  const leftEdge = invaders[0] % boardWidth === 0;

  const rightEdge =
    invaders[invaders.length - 1] % boardWidth === boardWidth - 1;

  return {
    left: leftEdge,
    right: rightEdge,
  };
};

export const setDirection = (edges, direction, boardWidth) => {
  let newDirection = direction;

  if ((edges.left && direction === -1) || (edges.right && direction === 1)) {
    newDirection = boardWidth;
  } else if (direction === boardWidth) {
    newDirection = edges.left ? 1 : -1;
  }

  return newDirection;
};

export const removeSplash = () => {
  const startScreen = document.querySelector("#splash");
  const startBtn = document.querySelector("#start");
  startBtn.disabled = true;

  startScreen.classList.add("hidden");
};

export const addSplash = () => {
  const startScreen = document.querySelector("#splash");
  const startBtn = document.querySelector("#start");

  setTimeout(() => {
    startBtn.disabled = false;
    startScreen.classList.remove("hidden");
  }, 500);
};
