const Player = (name, mark) => {
  this.name = name;
  this.mark = mark;

  const getName = () => name;

  const getMark = () => mark;

  return { getMark, getName };
};

const GameBoard = () => {
  const _board = new Array(9);

  const setField = (index, mark) => {
    if (index > _board.length) return;
    _board[index] = mark;
  };

  const getField = (index) => {
    if (index > _board.length) return;
    return _board[index];
  };

  const clearBoard = () => {
    for (let index = 0; index < 9; index++) {
      _board[index] = undefined;
    }
  };

  return { clearBoard, getField, setField };
};

const gameController = (() => {
  const playerX = Player("cross", "X");
  const playerO = Player("circle", "O");
  const gameBoard = GameBoard();

  let round = 1;
  let isGameOver = false;

  const playRound = (index) => {
    gameBoard.setField(index, getCurrentPlayer().getMark());

    if (checkForWin(index)) {
      isGameOver = true;
      displayController.displayWinner(
        getCurrentPlayer().getMark(),
        winningCombination()
      );
      return;
    }
    if (round === 9) {
      isGameOver = true;
      displayController.displayWinner("D");
      return;
    }

    ++round;
    displayController.displayMessage(
      `<span>${getCurrentPlayer().getMark()}</span><span>TURN</span>`
    );
  };

  const getCurrentPlayer = () => (round % 2 === 1 ? playerX : playerO);

  const winningCombination = () => {
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let result;
    winCombinations.forEach((combination) => {
      if (
        gameBoard.getField(combination[0]) ===
          gameBoard.getField(combination[1]) &&
        gameBoard.getField(combination[1]) ===
          gameBoard.getField(combination[2])
      ) {
        result = combination;
      }
    });
    return result;
  };

  const checkForWin = (index) => {
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winCombinations
      .filter((combination) => combination.includes(index))
      .some((possibleCombination) =>
        possibleCombination.every(
          (fieldIndex) =>
            gameBoard.getField(fieldIndex) === getCurrentPlayer().getMark()
        )
      );
  };

  const getIsGameOver = () => isGameOver;

  const resetGame = () => {
    gameBoard.clearBoard();
    isGameOver = false;
    round = 1;
  };

  return {
    getCurrentPlayer,
    getIsGameOver,
    playRound,
    resetGame,
  };
})();

const displayController = (() => {
  const fieldElements = document.querySelectorAll(".board-field"),
    scoreDisplayElements = document.querySelectorAll(".display-score"),
    restartButton = document.querySelector(".btn-restart"),
    messageDisplayElement = document.querySelector(".message-display");

  let circleWinCount = 0,
    crossWinCount = 0,
    drawGameCount = 0;

  fieldElements.forEach((element) =>
    element.addEventListener("click", (event) => {
      const fieldIndex = parseInt(event.target.dataset.index);
      if (gameController.getIsGameOver() || event.target.innerHTML !== "")
        return;

      updateBoard(fieldIndex);
      gameController.playRound(fieldIndex);
    })
  );

  const updateBoard = (index) => {
    const name = gameController.getCurrentPlayer().getName();
    fieldElements[
      index
    ].innerHTML = `<img src='./assets/${name}.svg' alt='${name}' />`;
    fieldElements[index].classList.add("disabled");
  };

  const displayMessage = (htmlContent) => {
    messageDisplayElement.innerHTML = htmlContent;
  };

  const displayWinner = (winner, combination) => {
    switch (winner) {
      case "D":
        displayMessage(`<span>DRAW</span>`);
        updateScore(winner);
        messageDisplayElement.classList.add("draw");
        return;
      case "X":
        displayMessage(`<span>X</span><span>WON</span>`);
        combination.forEach((index) =>
          fieldElements[index].classList.add(`winner-x`)
        );
        messageDisplayElement.classList.add("winner-x");
        updateScore(winner);
        return;
      case "O":
        displayMessage(`<span>O</span><span>WON</span>`);
        combination.forEach((index) =>
          fieldElements[index].classList.add(`winner-o`)
        );
        messageDisplayElement.classList.add("winner-o");
        updateScore(winner);
        return;
      default:
        console.error("Invalid Winner: " + winner);
        return;
    }
  };

  const updateScore = (winner) => {
    switch (winner) {
      case "D":
        scoreDisplayElements[1].textContent = ++drawGameCount;
        return;
      case "X":
        scoreDisplayElements[0].textContent = ++crossWinCount;
        return;
      case "O":
        scoreDisplayElements[2].textContent = ++circleWinCount;
        return;
      default:
        console.error("Invalid Winner: " + winner);
        return;
    }
  };

  restartButton.addEventListener("click", () => {
    gameController.resetGame();
    fieldElements.forEach((element) => {
      element.className = "board-field";
      element.innerHTML = "";
    });
    displayMessage("<span>X</span><span>TURN</span>");
    messageDisplayElement.className = "message-display";
  });

  return { displayMessage, displayWinner };
})();