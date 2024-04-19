document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board"); // Дъска
    const resultElement = document.getElementById("result"); // Резултат
    const scoreElement1= document.getElementById("score1"); // Точки за играч 1
    const scoreElement2 = document.getElementById("score2"); // Точки за играч 2
    const scoreElement3 = document.getElementById("score3"); // Равенства
    const resetBtn = document.getElementById("resetBtn"); // Бутон за нулиране

    let boardState = Array(9).fill(null); // Състояние на дъската
    let currentPlayer = "X"; // Текущ играч
    let gameActive = true; // Активна игра
    let score = { // Резултат
        player1: 0, // Играч 1
        player2: 0, // Играч 2
        ties: 0 // Равенства
    };

    const winningCombinations = [ // Победни комбинации
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function renderBoard() { // Функция за изобразяване на дъската
        board.innerHTML = ""; // Изчистване на дъската
        boardState.forEach((cell, index) => { // За всяка клетка на дъската
            const cellElement = document.createElement("div"); // Създаване на елемент клетка
            cellElement.classList.add("cell"); // Добавяне на клас "cell"
            cellElement.dataset.index = index; // Задаване на индекс на клетката
            cellElement.textContent = cell; // Задаване на текста на клетката
            cellElement.addEventListener("click", handleCellClick); // Добавяне на слушател за клик на клетката
            board.appendChild(cellElement); // Добавяне на клетката към дъската
        });
    }

    function handleCellClick(event) { // Функция за обработка на клик на клетка
        if (!gameActive || boardState[event.target.dataset.index]) { // Ако играта не е активна или клетката вече е заета
            return; // Прекратяване на функцията
        }

        boardState[event.target.dataset.index] = currentPlayer; // Записване на текущия играч в състоянието на дъската
        event.target.textContent = currentPlayer; // Записване на текущия играч в клетката

        if (checkWinner()) { // Ако има победител
            gameActive = false; // Играта не е вече активна
            resultElement.textContent = `Играч ${currentPlayer} печели!`; // Извеждане на съобщение за победа на текущия играч
            updateScore(currentPlayer); // Обновяване на резултата
        } else if (boardState.every(cell => cell !== null)) { // Ако всички клетки са заети
            gameActive = false; // Играта не е вече активна
            resultElement.textContent = "Равни!"; // Извеждане на съобщение за равенство
            updateScore("tie"); // Обновяване на резултата
        } else { // Ако няма победител и има още свободни клетки
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // Смяна на текущия играч
        }
    }

    function checkWinner() { // Функция за проверка на победител
        return winningCombinations.some(combination => // Връща true ако някоя от победните комбинации се състои от състоянията на дъската, които съответстват на текущия играч
            combination.every(index => boardState[index] === currentPlayer)
        );
    }

    function updateScore(winner) { // Функция за обновяване на резултата
        if (winner === "X") { // Ако победителят е играч X
            score.player1++; // Увеличаване на точките на играч 1
        } else if (winner === "O") { // Ако победителят е играч O
            score.player2++; // Увеличаване на точките на играч 2
        } else { // Ако играта завършва наравно
            score.ties++; // Увеличаване на броя на равенствата
        }

        scoreElement1.textContent = `Играч X: ${score.player1}`; // Обновяване на текста за точките на играч 1
        scoreElement2.textContent = `Играч O: ${score.player2}`; // Обновяване на текста за точките на играч 2
        scoreElement3.textContent = `Равни: ${score.ties}`; // Обновяване на текста за равенствата
    }

    function resetGame() { // Функция за нулиране на играта
        boardState = Array(9).fill(null); // Нулиране на състоянието на дъската
        currentPlayer = "X"; // Задаване на първия играч да е X
        gameActive = true; // Активиране на играта
        resultElement.textContent = ""; // Изчистване на резултатния елемент
        renderBoard(); // Изобразяване на дъската
    }

    resetBtn.addEventListener("click", resetGame); // Добавяне на слушател за клик на бутона за нулиране
    renderBoard(); // Изобразяване на дъската
});
