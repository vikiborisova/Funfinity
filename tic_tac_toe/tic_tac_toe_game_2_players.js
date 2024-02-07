document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const resultElement = document.getElementById("result");
    const scoreElement = document.getElementById("score");
    const resetBtn = document.getElementById("resetBtn");

    let boardState = Array(9).fill(null);
    let currentPlayer = "X";
    let gameActive = true;
    let score = {
        player: 0,
        computer: 0,
        ties: 0
    };

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function renderBoard() {
        board.innerHTML = "";
        boardState.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            cellElement.addEventListener("click", handleCellClick);
            board.appendChild(cellElement);
        });
    }

    function handleCellClick(event) {
        if (!gameActive || boardState[event.target.dataset.index]) {
            return;
        }

        boardState[event.target.dataset.index] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWinner()) {
            gameActive = false;
            resultElement.textContent = `Player ${currentPlayer} wins!`;
            updateScore(currentPlayer);
        } else if (boardState.every(cell => cell !== null)) {
            gameActive = false;
            resultElement.textContent = "It's a tie!";
            updateScore("tie");
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }

    function checkWinner() {
        return winningCombinations.some(combination =>
            combination.every(index => boardState[index] === currentPlayer)
        );
    }

    function updateScore(winner) {
        if (winner === "X") {
            score.player++;
        } else if (winner === "O") {
            score.computer++;
        } else {
            score.ties++;
        }

        scoreElement.textContent = `Player: ${score.player} | Computer: ${score.computer} | Ties: ${score.ties}`;
    }

    function resetGame() {
        boardState = Array(9).fill(null);
        currentPlayer = "X";
        gameActive = true;
        resultElement.textContent = "";
        renderBoard();
    }

    resetBtn.addEventListener("click", resetGame);
    renderBoard();
});