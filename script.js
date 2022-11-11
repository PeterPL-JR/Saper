const board = document.getElementById("board");
const style = document.documentElement.style;

const _BOMBS = 10;

const BOARD_SIZE = 600;
const MAP_SIZE = 8;
const FIELD_SIZE = BOARD_SIZE / MAP_SIZE;

const DEFAULT_FIELD_CLASS = "saper-field";
const SHOWN_FIELD_CLASS = "shown-saper-field";

let started = false;
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

class SaperField {
    constructor(x, y, div) {
        this.x = x;
        this.y = y;
        
        this.div = div;
        this.shown = false;
        this.bomb = false;
    }
    show() {
        if(this.shown) return;
        
        this.div.className = SHOWN_FIELD_CLASS;
        this.shown = true;

        if(this.bomb) {
            this.div.innerHTML = "<img src='bomb.png'>";
        } else {
            this.countBombs();
        }
    }
    setBomb() {
        this.bomb = true;
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
        if(bombs > 0) {
            this.div.innerHTML = bombs;
            this.div.style.color = COLORS[bombs];
        }
    }
}

function init() {
    style.setProperty("--saper-field-size", FIELD_SIZE + "px");
    
    for(let y = 0; y < MAP_SIZE; y++) {
        for(let x = 0; x < MAP_SIZE; x++) {
            
            const div = document.createElement("div");
            div.className = DEFAULT_FIELD_CLASS;
            div.setAttribute("onmousedown", `show(${x}, ${y})`);
            board.appendChild(div);
            fields.push(new SaperField(x, y, div));
        }
        const clearBoth = document.createElement("div");
        clearBoth.style.setProperty("clear", "both");
        board.appendChild(clearBoth); 
    }
}

function startGame(startedX, startedY) {
    started = true;
    setBombs(startedX, startedY);
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
        if(!field.bomb && !(x == startedX && y == startedY) && xDist >= MIN_DIST && yDist >= MIN_DIST) {
            field.setBomb();
            hiddenBombs++;
        }
    }
}

function show(x, y) {
    if(!started) startGame(x, y);

    const field = findField(x, y);
    field.show();
    console.log(field);
}

function findField(x, y) {
    return fields.find(function(field) {
        return field.x == x && field.y == y;
    });
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}