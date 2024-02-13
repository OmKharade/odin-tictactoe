const GameBoard = () => {
    const board = new Array(9);
  
    const setField = (index, mark) => {
      if (index > board.length) return;
      board[index] = mark;
    };
  
    const getField = (index) => {
      if (index > board.length) return;
      return board[index];
    };
  
    const clearBoard = () => {
      for (let index = 0; index < 9; index++) {
        board[index] = undefined;
      }
    };
  
    const printBoard = () => {
      let string = "";
      for (let index = 0; index < 9; index++) {
        if (index % 3 == 0) {
          string += "\n" + (board[index] ? board[index] : "*") + " ";
        } else {
          string += (board[index] ? board[index] : "*") + " ";
        }
      }
      console.log(string);
    };
  
    return { clearBoard, getField, printBoard, setField };
  };

  
const gameController = (() => {
    const playerX = { name: "X Player", mark: "X" };
    const playerO = { name: "O Player", mark: "O" };
    const gameBoard = GameBoard();

    let activePlayer = playerX;

    const switchPlayerTurn = () =>
        (activePlayer = activePlayer === playerX ? playerO : playerX);

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
            (fieldIndex) => gameBoard.getField(fieldIndex) === activePlayer.mark
            )
        );
    };

    const checkForDraw = () => {
        for (let index = 0; index < 9; index++) {
        if (gameBoard.getField(index) === undefined) {
            return false;
        }
        }
        return true;
    };

    const playRound = (index) => {
        gameBoard.setField(index, activePlayer.mark);
        gameBoard.printBoard();
        if (checkForWin(index)) {
        console.log(`${activePlayer.name} WON`);
        return;
        }
        if (checkForDraw()) {
        console.log("It's a tie!");
        return;
        }
        switchPlayerTurn();
        consoleGame();
    };

    const consoleGame = () => {
        console.log(`${activePlayer.name}'s Turn`);
        const fieldIndex = parseInt(prompt("Input the Index:"));
        playRound(fieldIndex);
    };

    console.log("Game Start");
    consoleGame();
})();