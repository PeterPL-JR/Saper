const board = document.getElementById("board");
const style = document.documentElement.style;

const timeDiv = document.getElementById("time");
const bombsDiv = document.getElementById("bombs");

const _BOMBS = 10;

const BOARD_SIZE = 600;
const MAP_SIZE = 9;
const FIELD_SIZE = BOARD_SIZE / MAP_SIZE;

const DEFAULT_FIELD_CLASS = "saper-field";
const SHOWN_FIELD_CLASS = "shown-saper-field";

let started = false;
let over = false;
let mouseButton = null;
let signedFields = 0;

let time = 0;
let timeInterval = null;

const fields = [];

const COLORS = {
    1: "blue",
    2: "green",
    3: "red",
    4: "navy",
    5: "maroon",
    6: "aqua",
    7: "black",
    8: "gray"
};

const FIELD_DEFAULT = 0;
const FIELD_SIGNED = 1;
const FIELD_WARNED = 2;

class SaperField {
    constructor(x, y, div) {
        this.x = x;
        this.y = y;
        
        this.div = div;
        this.state = FIELD_DEFAULT;

        this.shown = false;
        this.bomb = false;
    }
    show() {
        if(this.shown || this.state == FIELD_SIGNED) return;
        
        this.div.innerHTML = "";
        this.div.className = SHOWN_FIELD_CLASS;
        this.shown = true;

        if(this.bomb) {
            this.div.innerHTML = "<img src='bomb.png'>";
            this.div.style.backgroundColor = "red";
            gameOver();
        } else {
            this.setNumber();
        }
        checkVictory();
    }
    sign() {
        if(this.shown) return;

        this.state++;
        if(this.state > FIELD_WARNED) this.state = FIELD_DEFAULT;
        
        if(this.state == FIELD_DEFAULT) this.div.innerHTML = null;
        if(this.state == FIELD_SIGNED) this.div.innerHTML = "<img src='flag.png'>";
        if(this.state == FIELD_WARNED) this.div.innerHTML = "?";

        if(this.state == FIELD_SIGNED) {
            signedFields++;
        } else {
            signedFields--;
        }
    }
    setBomb() {
        this.bomb = true;
    }
    setNumber() {
        const bombs = this.countBombs();
        if(bombs > 0) {
            this.div.innerHTML = bombs;
            this.div.style.color = COLORS[bombs];
        }
    }
    countBombs() {
        let bombs = 0;

        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                const xPos = this.x - 1 + x;
                const yPos = this.y - 1 + y;

                const field = findField(xPos, yPos);
                if(field && field.bomb) {
                    bombs++;
                }
            }
        }
        return bombs;
    }
}

function init() {
    style.setProperty("--saper-field-size", FIELD_SIZE + "px");
    
    for(let y = 0; y < MAP_SIZE; y++) {
        for(let x = 0; x < MAP_SIZE; x++) {
            
            const div = document.createElement("div");
            div.className = DEFAULT_FIELD_CLASS;
            div.setAttribute("onmousedown", `mouseDown(${x}, ${y})`);
            board.appendChild(div);
            fields.push(new SaperField(x, y, div));
        }
        const clearBoth = document.createElement("div");
        clearBoth.style.setProperty("clear", "both");
        board.appendChild(clearBoth);
    }

    board.oncontextmenu = function() {
        return false;
    }
}

function startGame(startedX, startedY) {
    started = true;
    setBombs(startedX, startedY);
    startTimer();
}

function setBombs(startedX, startedY) {
    let hiddenBombs = 0;
    const MIN_DIST = 2;
    
    while(hiddenBombs < _BOMBS) {
        const x = getRandom(0, MAP_SIZE - 1);
        const y = getRandom(0, MAP_SIZE - 1);

        const xDist = Math.abs(x - startedX);
        const yDist = Math.abs(y - startedY);
        
        const field = findField(x, y);
        if(!field.bomb && !(x == startedX && y == startedY) && !(xDist < MIN_DIST && yDist < MIN_DIST)) {
            field.setBomb();
            hiddenBombs++;
        }
    }
}

const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 2;

function mouseDown(x, y) {
    if(over) return;

    if(window.event.button == LEFT_BUTTON) showField(x, y);
    if(window.event.button == RIGHT_BUTTON) signField(x, y);
}

function showField(x, y) {
    if(!started) startGame(x, y);
    showPath(x, y);
}
function signField(x, y) {
    findField(x, y).sign();
}

function findField(x, y) {
    return fields.find(function(field) {
        return field.x == x && field.y == y;
    });
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getZeros(number, requiredLength) {
    let len = number.toString().length;
    let zeros = "";

    for(let i = 0; i < requiredLength - len; i++) zeros += "0";
    return zeros;
}

function showPath(x, y) {
    const field = findField(x, y);
    if(!field || field.shown) return;
    field.show();
    
    if(field.countBombs() == 0) {
        showPath(x - 1, y);
        showPath(x + 1, y);

        showPath(x, y - 1);
        showPath(x, y + 1);
    }
}

function checkVictory() {
    let hidden = 0;
    for(let field of fields) {
        if(!field.shown) {
            hidden++;
        }
    }
    if(!over && hidden == _BOMBS) {
        victory();
    }
}

function startTimer() {
    const ONE_SECOND = 1000;

    timeInterval = setInterval(function() {
        updateTimer();
    }, ONE_SECOND);
}
function updateTimer() {
    time++;
    timeDiv.innerHTML = getZeros(time, 3) + time;
}
function stopTimer() {
    clearInterval(timeInterval);
}

function gameOver() {
    over = true;
    style.setProperty("--hover-saper-field-background", "gray");
    stopTimer();
}
function victory() {
    console.log("Victoria!");
    stopTimer();
}