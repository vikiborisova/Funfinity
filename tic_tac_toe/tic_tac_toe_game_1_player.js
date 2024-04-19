document.addEventListener("DOMContentLoaded", function () {
    // Слушател за събитието "DOMContentLoaded", който се изпълнява, когато DOM документа е готов

    // Инициализация на елементите от HTML
    const board = document.getElementById("board");
    const resultElement = document.getElementById("result");
    const scoreElement1= document.getElementById("score1");
    const scoreElement2 = document.getElementById("score2");
    const scoreElement3 = document.getElementById("score3");
    const resetBtn = document.getElementById("resetBtn");

    // Начално състояние на игралната дъска, текущ играч, статус на играта и резултат
    let boardState = Array(9).fill(null);
    let currentPlayer = "X";
    let gameActive = true;
    let score = {
        player: 0,
        computer: 0,
        ties: 0
    };

    // Възможни комбинации за печеливши ходове
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Функция за рендиране на игралната дъска
    function renderBoard() {
        // Изчистване на дъската
        board.innerHTML = "";
        // Създаване на клетките и добавяне на събитие при клик
        boardState.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            cellElement.addEventListener("click", handleCellClick);
            board.appendChild(cellElement);
        });
    }

    // Обработка на кликване върху клетка
    function handleCellClick(event) {
        // Проверка дали играта е активна или клетката е заета
        if (!gameActive || boardState[event.target.dataset.index]) {
            return;
        }

        // Отбелязване на хода на текущия играч
        boardState[event.target.dataset.index] = currentPlayer;
        event.target.textContent = currentPlayer;

        // Проверка за победител или равенство
        if (checkWinner()) {
            gameActive = false;
            resultElement.textContent = `Играчът печели!`;
            updateScore(currentPlayer);
        } else if (boardState.every(cell => cell !== null)) {
            gameActive = false;
            resultElement.textContent = "Равни!";
            updateScore("tie");
        } else {
            // Превключване на текущия играч
            currentPlayer = currentPlayer === "X" ? "O" : "X";

            // Ход на компютъра, ако е негов ред
            if (currentPlayer === "O") {
                setTimeout(computerMove, 500);
            }
        }
    }

    // Ход на компютъра
    function computerMove() {
        const winningMoveIndex = getWinningMoveIndex("O");
        const blockingMoveIndex = getWinningMoveIndex("X");

        // Ако има печеливш ход, компютърът го избира
        if (winningMoveIndex !== -1) {
            makeMove(winningMoveIndex);
        } else if (blockingMoveIndex !== -1) {
            // Ако може да блокира печеливш ход на противника, компютърът го избира
            makeMove(blockingMoveIndex);
        } else {
            // В противен случай компютърът прави случаен ход
            makeRandomMove();
        }
    }

    // Намиране на печеливши ходове за даден играч
    function getWinningMoveIndex(player) {
        // Проверка за всяка комбинация от печеливши ходове
        for (const combination of winningCombinations) {
            // Броене на наличните позиции на играча в текущата комбинация
            const countPlayer = combination.reduce((count, index) => {
                if (boardState[index] === player) {
                    return count + 1;
                }
                return count;
            }, 0);

            // Ако има две позиции на играча в комбинацията, намира празната позиция
            if (countPlayer === 2) {
                const emptyIndex = combination.find(index => boardState[index] === null);
                if (emptyIndex !== undefined) {
                    return emptyIndex;
                }
            }
        }

        return -1;
    }

    // Случаен ход на компютъра
    function makeRandomMove() {
        const emptyCells = boardState.reduce((acc, cell, index) => {
            if (!cell) {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const computerMoveIndex = emptyCells[randomIndex];

        makeMove(computerMoveIndex);
    }

    // Извършване на ход
    function makeMove(index) {
        // Отбелязване на хода на компютъра
        boardState[index] = currentPlayer;
        const computerCell = document.querySelector(`.cell[data-index="${index}"]`);
        computerCell.textContent = currentPlayer;

        // Проверка за победител или равенство
        if (checkWinner()) {
            gameActive = false;
            resultElement.textContent = "Компютърът печели!";
            updateScore("O");
        } else if (boardState.every(cell => cell !== null)) {
            gameActive = false;
            resultElement.textContent = "Равни!";
            updateScore("tie");
        } else {
            // Превключване на текущия играч
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }

    // Проверка за победител
    function checkWinner() {
        return winningCombinations.some(combination =>
            combination.every(index => boardState[index] === currentPlayer)
        );
    }

    // Актуализация на резултата
    function updateScore(winner) {
        if (winner === "X") {
            score.player++;
        } else if (winner === "O") {
            score.computer++;
        } else {
            score.ties++;
        }

        // Отразяване на резултата в HTML
        scoreElement1.textContent = `Играч: ${score.player}`;
        scoreElement2.textContent = `Компютър: ${score.computer}`;
        scoreElement3.textContent = `Равни: ${score.ties}`;
    }

    // Нулиране на играта
    function resetGame() {
        boardState = Array(9).fill(null);
        currentPlayer = "X";
        gameActive = true;
        resultElement.textContent = "";
        renderBoard();

        // Проверка за ход на компютъра
        if (currentPlayer === "O") {
            setTimeout(computerMove, 500);
        }
    }

    // Добавяне на слушател за нулиране на играта
    resetBtn.addEventListener("click", resetGame);
    // Рендиране на началната игрална дъска
    renderBoard();
});
