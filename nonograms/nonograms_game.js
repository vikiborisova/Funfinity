// Дефинира възможните опции за клетките
const CELL_STATES = ["none", "off", "on"];

// променливи за полето и състоянието на играта
let w, h;
let fstate = {
    field: [],
    solution: [],
    keys: {
        h: [],
        v: []
    }
};
let solutionOn = false,
    solutionShown = false;

// Генерира случайно число между минимума и максимума
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция за попълване на 2D масив
function fillArrayColumnwise(array, col, value, rowOffset, rowCount) {
    for (let i = rowOffset; i < rowOffset + rowCount; i++) {
        array[i][col] = value;
    }
}

// Функция която разбърква масива
function shuffle(array) {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// Генерира полето за игра
function generateField() {
    let st = {
        field: [],
        solution: [],
        keys: {
            h: [],
            v: []
        }
    };

    // Имплементира 0 на началните клетки
    let mainField = st.field;
    for (let i = 0; i < h; i++) {
        mainField[i] = [];
        for (let j = 0; j < w; j++) {
            mainField[i][j] = 0;
        }
    }

    // Генерира ключове за всяка колона (хоризонтални ключове)
    let maxKeys;
    switch (Math.floor(h / 5)) {
        case 1:
            maxKeys = 2;
            break;
        case 2:
        case 3:
            maxKeys = 3;
            break;
        case 4:
            maxKeys = 5;
            break;
        case 5:
            maxKeys = 6;
            break;
        default:
            maxKeys = Math.ceil(h / 4) - 1;
    }

    let hkeys = st.keys.h;
    for (let i = 0; i < w; i++) {
        hkeys[i] = [];
        let n = getRandomInt(1, maxKeys);

        let left = h - n + 1;
        let key;
        for (let j = 0; j < n; j++) {
            key = getRandomInt(1, left - n + j);
            left -= key;
            hkeys[i].push(key);
        }

        shuffle(hkeys[i]);
    }

    // генерира отмествания за всяка колона
    let offsets = [];
    for (let i = 0; i < w; i++) {
        offsets[i] = [];

        let keys = st.keys.h[i],
            kn = keys.length;
        let left = h - keys.reduce((a, c) => a + c, 0);

        for (let j = 1; j < kn; j++) {
            let offset = getRandomInt(1, left - (kn - 1) + j);
            offsets[i].push(offset);
            left -= offset;
        }
        shuffle(offsets[i]);

        let offset = getRandomInt(0, left);
        offsets[i].unshift(offset);
        left -= offset;

        offsets[i].push(left);
    }

    // генерира решение на базата на ключовете и отместванията
    let field = st.solution;
    for (let i = 0; i < h; i++) {
        field[i] = [];
    }
    for (let i = 0; i < w; i++) {
        let keys = st.keys.h[i],
            kn = keys.length,
            offs = offsets[i];
        let offset = 0;

        for (let j = 0; j < kn; j++) {
            fillArrayColumnwise(field, i, 1, offset, offs[j]);
            offset += offs[j];

            fillArrayColumnwise(field, i, 2, offset, keys[j]);
            offset += keys[j];
        }

        fillArrayColumnwise(field, i, 1, offset, offs[kn]);
    }

    // генерира вертикални ключове на базата на решението
    let vkeys = st.keys.v;
    for (let i = 0; i < h; i++) {
        vkeys[i] = [];
        let length = 0;

        for (let j = 0; j < w; j++) {
            if (field[i][j] === 2) {
                length++;
            } else {
                if (length > 0) {
                    vkeys[i].push(length);
                }
                length = 0;
            }
        }

        if (length > 0) {
            vkeys[i].push(length);
        }
    }

    return st;
}

// Инициализиране на масиви за клетки и header-и
let cells = [];
let headers = {
    h: [],
    v: []
};

// функция за подчертаване/запълване/отбелязване на клетка
function highlightCellOn(cell) {
    cell.classList.add("highlight");
}

// функция за премахване на подчертаване/запълване/отбелязване на клетка
function highlightCellOff(cell) {
    cell.classList.remove("highlight");
}

// функция за подчертаване header-и на базата на координатите на клетката
function highlightHeadersOn(x, y) {
    if (typeof x == "number") {
        highlightCellOn(headers.v[y]);
        highlightCellOn(headers.h[x]);
    } else if (typeof x == "object") {
        for (let el of x) {
            highlightHeadersOn(el.x, el.y);
        }
    }
}

// премахва подчертаването от всички клетки
function highlightHeadersOff() {
    for (let i = 0; i < h; i++) {
        highlightCellOff(headers.v[i]);
    }

    for (let i = 0; i < w; i++) {
        highlightCellOff(headers.h[i]);
    }
}

// Променливи за проследяване на състоянието и координатите на плъзгане на мишката
let isDragging = false;
let startX, startY, mouseState;

// Функция за получаване на обхвата на засегнатите клетки по време на плъзгане
function getAffectedCellsRange(startX, startY, lastX, lastY) {
    let xmin = Math.min(startX, lastX),
        ymin = Math.min(startY, lastY),
        xmax = Math.max(startX, lastX),
        ymax = Math.max(startY, lastY);

    let direction = xmax - xmin < ymax - ymin;

    let range = [];

    if (mouseState == "none") {
        for (let i = xmin; i <= xmax; i++) {
            for (let j = ymin; j <= ymax; j++) {
                let el = {
                    x: i,
                    y: j
                };
                range.push(el);
            }
        }
    } else {
        if (direction === false) {
            for (let i = xmin; i <= xmax; i++) {
                let el = {
                    x: i,
                    y: startY
                };
                range.push(el);
            }
        } else {
            for (let i = ymin; i <= ymax; i++) {
                let el = {
                    x: startX,
                    y: i
                };
                range.push(el);
            }
        }
    }

    return range;
}

// Обработчик на събития за мишката върху клетка
function onCellMouseDown(x, y, e) {
    if (solutionOn) return;

    switch (e.button) {
        case 0:
            mouseState = "on";
            break;
        case 1:
            mouseState = "none";
            break;
        case 2:
            mouseState = "off";
            break;
        default:
            return;
    }

    isDragging = true;

    startX = x;
    startY = y;

    markCell(x, y, mouseState);

    e.preventDefault();
    return false;
}

//Обработчик на събития за въвеждане на мишката в клетка
function onCellMouseEnter(x, y) {
    if (isDragging) {
        for (let i = 0; i < h; i++) {
            resetCellMark(startX, i);
        }

        for (let i = 0; i < w; i++) {
            resetCellMark(i, startY);
        }

        let range = getAffectedCellsRange(startX, startY, x, y);
        highlightHeadersOn(range);

        for (let el of range) {
            markCell(el.x, el.y, mouseState);
        }

    } else {

        highlightHeadersOn(x, y);

    }
}

// Обработчик на събития за напускане на клетка от мишката
function onCellMouseLeave(x, y) {
    highlightHeadersOff();

    if (isDragging) {
        resetCellMark(x, y);
    }
}

// Манипулатор на събития за мишката върху клетка
function onCellMouseUp(x, y) {
    if (solutionOn) return;

    if (isDragging) {
        // Save changes
        let range = getAffectedCellsRange(startX, startY, x, y);
        for (let el of range) {
            fstate.field[el.y][el.x] = CELL_STATES.indexOf(mouseState);
        }

        highlightHeadersOff();
        highlightHeadersOn(x, y);
    }

    isDragging = false;

    checkVictory();
}

// Функция за маркиране на клетка със състояние
function markCell(x, y, state) {
    let cell = cells[y][x];
    cell.classList.remove(...CELL_STATES);
    cell.classList.add(state);
}

// Функция за нулиране на знака на клетка
function resetCellMark(x, y) {
    const state = CELL_STATES[fstate.field[y][x]];
    markCell(x, y, state);
}

//Функция за изобразяване на игралната решетка
function renderTable() {
    let table = document.getElementById("game");

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    cells = [];
    headers = { h: [], v: [] };

    for (let i = 0; i < w; i++) {
        let el = document.createElement("th");
        headers.h.push(el);
    }

    for (let i = 0; i < h; i++) {
        let el = document.createElement("th");
        headers.v.push(el);
    }

    for (let i = 0; i < h; i++) {
        cells[i] = [];

        for (let j = 0; j < w; j++) {
            let el = document.createElement("td");

            el.dataset.x = j;
            el.dataset.y = i;

            el.onmousedown = onCellMouseDown.bind(null, j, i);
            el.onmouseenter = onCellMouseEnter.bind(null, j, i);
            el.onmouseleave = onCellMouseLeave.bind(null, j, i);
            el.onmouseup = onCellMouseUp.bind(null, j, i);
            el.oncontextmenu = () => {
                return false;
            };

            cells[i].push(el);
        }
    }

    let headerTr = document.createElement("tr");

    let emptyHeader = document.createElement("th");
    headerTr.appendChild(emptyHeader);

    for (let i = 0; i < w; i++) {
        headerTr.appendChild(headers.h[i]);
    }
    table.appendChild(headerTr);

    for (let i = 0; i < h; i++) {
        let tr = document.createElement("tr");
        tr.appendChild(headers.v[i]);
        for (let j = 0; j < w; j++) {
            tr.appendChild(cells[i][j]);
        }
        table.appendChild(tr);
    }
}

// Функция за настройка на полето на таблицата
function setTableField(field) {
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let state = CELL_STATES[field[i][j]];
            markCell(j, i, state);
        }
    }
}

//Функция за задаване на header-ите на таблицата
function setTableHeaders(keys) {
    for (let i = 0; i < h; i++) {
        let str = keys.v[i].join(" ");
        headers.v[i].innerText = str;
    }

    for (let i = 0; i < w; i++) {
        let str = keys.h[i].join("\n");
        headers.h[i].innerText = str;
    }
}

// рестартиране на играта
function reset() {
    h = 15;
    w = 15;
    reload();
}

//презареждане на играта
function reload() {
    solutionOn = false;
    solutionShown = false;

    h = document.getElementById("set-h").value;
    w = document.getElementById("set-w").value;

    fstate = generateField();
    renderTable();
    redraw();
}

// Функция за преначертаване на игралната решетка
function redraw() {
    setTableHeaders(fstate.keys);
    if (solutionOn) {
        setTableField(fstate.solution);
    } else {
        setTableField(fstate.field);
    }
}

// скрива/показва решението
function showSolution() {
    solutionShown = true;
    solutionOn = !solutionOn;
    redraw();
}

// проверява за победа
function checkVictory() {
    if (solutionOn) return false;

    let markedCells = 0;
    let correctCells = 0;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (fstate.field[i][j] !== 0) { // проверява дали всички клетки са запълнени
                markedCells++;

                if (fstate.solution[i][j] === fstate.field[i][j]) { // проверява дали запълнените клетки отговарят на решението
                    correctCells++;
                }
            }
        }
    }

    if (markedCells === h * w) { // ако клетките са запълнени
        if (correctCells === h * w) {
            alert("Поздравения! Спечели играта!");
        } else {
            alert("Ти загуби! Маркираните клетки не отговарят на решението! Опитай отново!\n \n Ако желаеш да провериш къде ти е грешката, натисни бутона с крушката 'Решение'.");
        }
    }
}

// Слушатели на събития за бутони "Нова игра" и  "Решение"
document.getElementById("new-game").onclick = reload;
document.getElementById("solution").onclick = showSolution;

// Първоначална настройка на играта
reset();

// Слушатели на събития за полета за въвеждане за ограничаване на измерения между 3 и 10
document.getElementById("set-h").addEventListener("input", function () {
    let value = parseInt(this.value);
    if (value < 3) {
        this.value = 3;
    } else if (value > 10) {
        this.value = 10;
    }
});

document.getElementById("set-w").addEventListener("input", function () {
    let value = parseInt(this.value);
    if (value < 3) {
        this.value = 3;
    } else if (value > 10) {
        this.value = 10;
    }
});
