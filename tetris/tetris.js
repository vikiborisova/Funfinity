function get(id) { return document.getElementById(id); }
// Връща елемент от HTML документа, който има даден идентификатор

function hide(id) { get(id).style.visibility = 'hidden'; }
// Скрива елемент от HTML документа, като му променя видимостта на "скрит"

function show(id) { get(id).style.visibility = null; }
// Показва скрит елемент от HTML документа, като възстановява неговата видимост

function html(id, html) { get(id).innerHTML = html; }
// Задава HTML код към съдържанието на даден HTML елемент по зададен идентификатор

function timestamp() { return new Date().getTime(); }
// Връща времевата марка на текущия момент в милисекунди

function random(min, max) { return (min + (Math.random() * (max - min))); }
// Връща случайно число в интервала [min, max)

function randomChoice(choices) { return choices[Math.round(random(0, choices.length - 1))]; }
// Избира случайно елемент от масив от възможности

if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        }
}

// Дефиниране на константи за клавишите и насоките
var KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
    DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 },
    // Получаване на референции към canvas и контекста на canvas
    canvas = get('canvas'),
    ctx = canvas.getContext('2d'),
    ucanvas = get('upcoming'),
    uctx = ucanvas.getContext('2d'),
    // Дефиниране на скоростта и размера на тетрис блоковете
    speed = { start: 0.6, decrement: 0.005, min: 0.1 },
    nx = 10,
    ny = 20,
    nu = 5;


var dx, dy,        // размер в пиксели на единичен блок тетрис
    blocks,        // двумерен масив (nx*ny), представящ тетрис игралното поле - или празен блок, или зает от 'пиеса'
    actions,       // опашка от действия на потребителя (входове)
    playing,       // true|false - играта е в ход
    dt,            // време от стартирането на тази игра
    current,       // текущото парче
    next,          // следващата пиеса
    score,         // текущият резултат
    vscore,        // текущо показван резултат (се надминава от резултата на малки порции - като въртяща се игрова машина)
    rows,          // брой завършени редове в текущата игра
    step;          // колко време преди текущото парче да падне с 1 ред

    // Дефинира обект, представляващ тип [съответната буква] с размер, блокове и цвят
var i = { size: 4, blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: '#2B2754' };
var j = { size: 3, blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: '#352C9D' };
var l = { size: 3, blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: '#5C2A9D' };
var o = { size: 2, blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: '#8A4073' };
var s = { size: 3, blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: '#42367F' };
var t = { size: 3, blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: '#A282BF' };
var z = { size: 3, blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: '#E8DDF2' };

// Извиква функцията fn за всеки блок от дадения тип парче, зададен на координатите (x, y)
function eachblock(type, x, y, dir, fn) {
    var bit, result, row = 0, col = 0, blocks = type.blocks[dir];
    for (bit = 0x8000; bit > 0; bit = bit >> 1) {
        if (blocks & bit) {
            fn(x + col, y + row);
        }
        if (++col === 4) {
            col = 0;
            ++row;
        }
    }
}
// Проверява дали дадена позиция е заета от парче с дадения тип и насока
function occupied(type, x, y, dir) {
    var result = false
    eachblock(type, x, y, dir, function (x, y) {
        if ((x < 0) || (x >= nx) || (y < 0) || (y >= ny) || getBlock(x, y))
            result = true;
    });
    return result;
}

// Проверява дали дадена позиция не е заета от парче с дадения тип и насока
function unoccupied(type, x, y, dir) {
    return !occupied(type, x, y, dir);
}

var pieces = [];
// Генерира случайно избран0 парче
function randomPiece() {
    if (pieces.length == 0)
        pieces = [i, i, i, i, j, j, j, j, l, l, l, l, o, o, o, o, s, s, s, s, t, t, t, t, z, z, z, z];
    var type = pieces.splice(random(0, pieces.length - 1), 1)[0];
    return { type: type, dir: DIR.UP, x: Math.round(random(0, nx - type.size)), y: 0 };
}
// Инициализира играта и започва изпълнението на главното игрово поле
function run() {

    addEvents();

    var last = now = timestamp();
    function frame() {
        now = timestamp();
        update(Math.min(1, (now - last) / 1000.0));
        draw();
        last = now;
        requestAnimationFrame(frame, canvas);
    }

    resize();
    reset();
    frame();

}

// Добавя обработчици на събития за клавиатурата и прозореца
function addEvents() {
    document.addEventListener('keydown', keydown, false);
    window.addEventListener('resize', resize, false);
}
 // Актуализира размерите на canvas елементите и променливите свързани с тях
function resize(event) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ucanvas.width = ucanvas.clientWidth;
    ucanvas.height = ucanvas.clientHeight;
    dx = canvas.width / nx;
    dy = canvas.height / ny;
    invalidate();
    invalidateNext();
}

// Обработва натисканията на клавиши от потребителя
function keydown(ev) {
    var handled = false;
    if (playing) {
        switch (ev.keyCode) {
            case KEY.LEFT: actions.push(DIR.LEFT); handled = true; break;
            case KEY.RIGHT: actions.push(DIR.RIGHT); handled = true; break;
            case KEY.UP: actions.push(DIR.UP); handled = true; break;
            case KEY.DOWN: actions.push(DIR.DOWN); handled = true; break;
            case KEY.ESC: lose(); handled = true; break;
        }
    }
    else if (ev.keyCode == KEY.SPACE) {
        play();
        handled = true;
    }
    if (handled)
        ev.preventDefault();
}
 // Започва играта
function play() { show('start'); reset(); playing = true; }
 // Завършва играта и показва съобщение за загуба
function lose() { show('start'); setVisualScore(); playing = false; alert("Ти загуби играта! Опитай отново!"); }
// Паузира играта
function wait() { show('start'); playing = false; }
//Продължава играта
function continuePlay() { show('start'); playing = true; }
// Задава визуалния резултат
function setVisualScore(n) { vscore = n || score; invalidateScore(); }
// Задава резултата
function setScore(n) { score = n; setVisualScore(n); }
 // Увеличава резултата
function addScore(n) { score = score + n; }
// Изчиства резултата
function clearScore() { setScore(0); }
// Изчиства броя на завършените редове
function clearRows() { setRows(0); }
 // Задава броя на завършените редове
function setRows(n) { rows = n; step = Math.max(speed.min, speed.start - (speed.decrement * rows)); invalidateRows(); }
// Увеличава броя на завършените редове
function addRows(n) { setRows(rows + n); }
// Връща типа на парчетата на дадени координати
function getBlock(x, y) { return (blocks && blocks[x] ? blocks[x][y] : null); }
// Задава парчетата на дадени координати
function setBlock(x, y, type) { blocks[x] = blocks[x] || []; blocks[x][y] = type; invalidate(); }
 // Изчиства всички парчета
function clearBlocks() { blocks = []; invalidate(); }
// Изчиства действията на потребителя
function clearActions() { actions = []; }
// Задава текущо парче
function setCurrentPiece(piece) { current = piece || randomPiece(); invalidate(); }
  // Задава следващо парче
function setNextPiece(piece) { next = piece || randomPiece(); invalidateNext(); }
// Нулира всички настройки и започва нова игра
function reset() {
    dt = 0;
    clearActions();
    clearBlocks();
    clearRows();
    clearScore();
    setCurrentPiece(next);
    setNextPiece();
}

 // Актуализира състоянието на играта
function update(idt) {
    if (playing) {
        if (vscore < score)
            setVisualScore(vscore + 1);
        handle(actions.shift());
        dt = dt + idt;
        if (dt > step) {
            dt = dt - step;
            drop();
        }
    }
}
 // Обработва действията на потребителя
function handle(action) {
    switch (action) {
        case DIR.LEFT: move(DIR.LEFT); break;
        case DIR.RIGHT: move(DIR.RIGHT); break;
        case DIR.UP: rotate(); break;
        case DIR.DOWN: drop(); break;
    }
}
// Премества текущото парче в дадена посока
function move(dir) {
    var x = current.x, y = current.y;
    switch (dir) {
        case DIR.RIGHT: x = x + 1; break;
        case DIR.LEFT: x = x - 1; break;
        case DIR.DOWN: y = y + 1; break;
    }
    if (unoccupied(current.type, x, y, current.dir)) {
        current.x = x;
        current.y = y;
        invalidate();
        return true;
    }
    else {
        return false;
    }
}
 // Завърта текущото парче
function rotate() {
    var newdir = (current.dir == DIR.MAX ? DIR.MIN : current.dir + 1);
    if (unoccupied(current.type, current.x, current.y, newdir)) {
        current.dir = newdir;
        invalidate();
    }
}

// Позволява текущото парче да падне надолу
function drop() {
    if (!move(DIR.DOWN)) {
        addScore(10);
        dropPiece();
        removeLines();
        setCurrentPiece(next);
        setNextPiece(randomPiece());
        clearActions();
        if (occupied(current.type, current.x, current.y, current.dir)) {
            lose();
        }
    }
}
// Позволява падането на текущото парче в игралното поле
function dropPiece() {
    eachblock(current.type, current.x, current.y, current.dir, function (x, y) {
        setBlock(x, y, current.type);
    });
}
// Премахва завършените редове и изчислява резултата
function removeLines() {
    var x, y, complete, n = 0;
    for (y = ny; y > 0; --y) {
        complete = true;
        for (x = 0; x < nx; ++x) {
            if (!getBlock(x, y))
                complete = false;
        }
        if (complete) {
            removeLine(y);
            y = y + 1;
            n++;
        }
    }
    if (n > 0) {
        addRows(n);
        addScore(100 * Math.pow(2, n - 1));
    }
}
// Премахва даден ред от игралното поле
function removeLine(n) {
    var x, y;
    for (y = n; y >= 0; --y) {
        for (x = 0; x < nx; ++x)
            setBlock(x, y, (y == 0) ? null : getBlock(x, y - 1));
    }
}
var invalid = {};
// Поема canvas за прерисуване
function invalidate() { invalid.court = true; }
// Поема следващата пиеса за прерисуване
function invalidateNext() { invalid.next = true; }
// Поема резултата за прерисуване
function invalidateScore() { invalid.score = true; }
// Поема броя на завършените редове за прерисуване
function invalidateRows() { invalid.rows = true; }
// Прерисува целия игрален интерфейс
function draw() {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.translate(0.5, 0.5);
    drawCourt();
    drawNext();
    drawScore();
    drawRows();
    ctx.restore();
}
 // Прерисува игралното поле
function drawCourt() {
    if (invalid.court) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (playing)
            drawPiece(ctx, current.type, current.x, current.y, current.dir);
        var x, y, block;
        for (y = 0; y < ny; y++) {
            for (x = 0; x < nx; x++) {
                if (block = getBlock(x, y))
                    drawBlock(ctx, x, y, block.color);
            }
        }
        ctx.strokeRect(0, 0, nx * dx - 1, ny * dy - 1);
        invalid.court = false;
    }
}
// Прерисува следващото парче
function drawNext() {
    if (invalid.next) {
        var padding = (nu - next.type.size) / 2;
        uctx.save();
        uctx.translate(0.5, 0.5);
        uctx.clearRect(0, 0, nu * dx, nu * dy);
        drawPiece(uctx, next.type, padding, padding, next.dir);
        uctx.strokeStyle = 'black';
        uctx.strokeRect(0, 0, nu * dx - 1, nu * dy - 1);
        uctx.restore();
        invalid.next = false;
    }
}
// Прерисува резултата
function drawScore() {
    if (invalid.score) {
        html('score', ("00000" + Math.floor(vscore)).slice(-5));
        invalid.score = false;
    }
}
// Прерисува броя на завършените редове
function drawRows() {
    if (invalid.rows) {
        html('rows', rows);
        invalid.rows = false;
    }
}
// Прерисува дадено парче
function drawPiece(ctx, type, x, y, dir) {
    eachblock(type, x, y, dir, function (x, y) {
        drawBlock(ctx, x, y, type.color);
    });
}
// Прерисува даден блок от парче
function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * dx, y * dy, dx, dy);
    ctx.strokeRect(x * dx, y * dy, dx, dy)
}

run();