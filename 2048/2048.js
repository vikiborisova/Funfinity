document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const resultDisplay = document.getElementById('result')
    let squares = []
    const width = 4
    let score = 0

    //създава решетката
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            square = document.createElement('div')
            square.innerHTML = 0
            gridDisplay.appendChild(square)
            squares.push(square)
        }
        generate()
        generate()
    }
    createBoard()

    //генерира блокче със стойност 2 след всеки ход
    function generate() {
        randomNumber = Math.floor(Math.random() * squares.length)
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2
            checkForGameOver()
        } else generate()
    }

    //сумира блокчета с преместване надясно ако е възможно
    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)

                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }

    //сумира блокчета с преместване наляво ако е възможно
    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)

                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }


    //сумира блокчета с преместване нагоре ако е възможно
    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + (width * 2)].innerHTML
            let totalFour = squares[i + (width * 3)].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)

            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + (width * 2)].innerHTML = newColumn[2]
            squares[i + (width * 3)].innerHTML = newColumn[3]
        }
    }

    //сумира блокчета с преместване надолу ако е възможно
    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + (width * 2)].innerHTML
            let totalFour = squares[i + (width * 3)].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)

            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + (width * 2)].innerHTML = newColumn[2]
            squares[i + (width * 3)].innerHTML = newColumn[3]
        }
    }

    //функцията за сумиране по редове
    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + 1].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    //функцията за сумиране по колони
    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + width].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    //командите от клавиатурата --> стрелките
    function control(e) {
        if (e.keyCode === 37) {
            keyLeft()
        } else if (e.keyCode === 38) {
            keyUp()
        } else if (e.keyCode === 39) {
            keyRight()
        } else if (e.keyCode === 40) {
            keyDown()
        }
    }
    document.addEventListener('keyup', control)

    //дясна стрелка
    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    //лява стрелка
    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }

    //горна стрелка
    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }

    //долна стрелка
    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }

    //проверява за победа
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                alert("You Win!!!")
                document.removeEventListener('keyup', control)
                setTimeout(() => clear(), 3000)
            }
        }
    }

    //проверява за загуба
    function checkForGameOver() {
        let movesAvailable = false;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                movesAvailable = true;
                break;
            }
        }
        for (let i = 0; i < squares.length; i++) {
            if (i % width < width - 1) {
                if (squares[i].innerHTML == squares[i + 1].innerHTML) {
                    movesAvailable = true;
                    break;
                }
            }
            if (Math.floor(i / width) < width - 1) {
                if (squares[i].innerHTML == squares[i + width].innerHTML) {
                    movesAvailable = true;
                    break;
                }
            }
        }
        if (!movesAvailable) {
            document.removeEventListener('keyup', control);
            setTimeout(() => clear(), 3000);
            alert("You Lose!!!");
        }
    }

    //изчиства таймера
    function clear() {
        clearInterval(myTimer)
    }


    //задава цвят за всяко блокче
    function addColours() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = 'white'
            else if (squares[i].innerHTML == 2) squares[i].style.backgroundColor = '#8176D0'
            else if (squares[i].innerHTML == 4) squares[i].style.backgroundColor = '#2E0A7D'
            else if (squares[i].innerHTML == 8) squares[i].style.backgroundColor = '#B25795'
            else if (squares[i].innerHTML == 16) squares[i].style.backgroundColor = '#7A1D82'
            else if (squares[i].innerHTML == 32) squares[i].style.backgroundColor = '#5C2A9D'
            else if (squares[i].innerHTML == 64) squares[i].style.backgroundColor = '#42367F'
            else if (squares[i].innerHTML == 128) squares[i].style.backgroundColor = '#352C9D'
            else if (squares[i].innerHTML == 256) squares[i].style.backgroundColor = '#521C84'
            else if (squares[i].innerHTML == 512) squares[i].style.backgroundColor = '#A282BF'
            else if (squares[i].innerHTML == 1024) squares[i].style.backgroundColor = '#822F7B'
            else if (squares[i].innerHTML == 2048) squares[i].style.backgroundColor = '#350B31'
        }
    }
    addColours()

    var myTimer = setInterval(addColours, 50)

    const restartButton = document.getElementById('restart-button')
    restartButton.addEventListener('click', refreshPage)

    //рестартира страницата
    function refreshPage() {
        location.reload()
    }

})
