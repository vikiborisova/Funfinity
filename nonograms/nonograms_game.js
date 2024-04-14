const CELL_STATES = ["none", "off", "on"];

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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillArrayColumnwise(array, col, value, rowOffset, rowCount) {
    for (let i = rowOffset; i < rowOffset + rowCount; i++) {
        array[i][col] = value;
    }
}

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
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

function generateField() {
    let st = {
        field: [],
        solution: [],
        keys: {
            h: [],
            v: []
        }
    };

    let mainField = st.field;
    for (let i = 0; i < h; i++) {
        mainField[i] = [];
        for (let j = 0; j < w; j++) {
            mainField[i][j] = 0;
        }
    }

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


let cells = [];
let headers = {
    h: [],
    v: []
};

function highlightCellOn(cell) {
    cell.classList.add("highlight");
}

function highlightCellOff(cell) {
    cell.classList.remove("highlight");
}

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

function highlightHeadersOff() {
    for (let i = 0; i < h; i++) {
        highlightCellOff(headers.v[i]);
    }

    for (let i = 0; i < w; i++) {
        highlightCellOff(headers.h[i]);
    }
}


let isDragging = false;
let startX, startY, mouseState;

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

function onCellMouseLeave(x, y) {
    highlightHeadersOff();

    if (isDragging) {
        resetCellMark(x, y);
    }
}

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

function markCell(x, y, state) {
    let cell = cells[y][x];
    cell.classList.remove(...CELL_STATES);
    cell.classList.add(state);
}

function resetCellMark(x, y) {
    const state = CELL_STATES[fstate.field[y][x]];
    markCell(x, y, state);
}

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

function setTableField(field) {
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let state = CELL_STATES[field[i][j]];
            markCell(j, i, state);
        }
    }
}

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

function reset() {
    h = 15;
    w = 15;
    reload();
}

function reload() {
    solutionOn = false;
    solutionShown = false;

    h = document.getElementById("set-h").value;
    w = document.getElementById("set-w").value;

    fstate = generateField();
    renderTable();
    redraw()
}

function redraw() {
    setTableHeaders(fstate.keys);
    if (solutionOn) {
        setTableField(fstate.solution);
    } else {
        setTableField(fstate.field);
    }
}

function showSolution() {
    solutionShown = true;
    solutionOn = !solutionOn;
    redraw();
}

function checkVictory() {
    if (solutionOn) return false;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (fstate.solution[i][j] !== fstate.field[i][j]) {
                return false;
            }
        }
    }


    alert("You win!");
}

document.getElementById("new-game").onclick = reload;
document.getElementById("solution").onclick = showSolution;

reset();

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