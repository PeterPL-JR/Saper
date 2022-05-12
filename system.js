const tileSize = 50;
const mapSize = 9;

var container = getId("container");
var firstClicked = false;

var firstX = -1;
var firstY = -1;

const size = tileSize * mapSize;
const boundsPositions = [];

const tiles = [];
const bombs = [];

const colors = [
    "blue", "green", "red", "darkblue",
    "darkred", "white", "white", "white"
];

container.style.width = size + "px";
container.style.height = size + "px";

function createTiles() {
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            if (x == 0 && y == 0) continue;
            boundsPositions.push([x, y]);
        }
    }

    for (var x = 0; x < mapSize; x++) {
        tiles[x] = [];
        for (var y = 0; y < mapSize; y++) {
            var div = document.createElement("div");
            div.className = "tile tile-hidden";
            div.setAttribute("onclick", `clickTile(${x}, ${y});`);
            container.appendChild(div);

            tiles[x][y] = {
                obj: div,
                bounds: 0,
                bomb: false
            };
        }
    }
}

function createBombs() {
    for (var i = 0; i < 10; i++) {
        var randX = getRandom(0, 8);
        var randY = getRandom(0, 8);

        console.log("FirstX: ", firstX, ", X: ", randX);
        console.log("FirstY: ", firstY, ", Y: ", randY);
        console.log("\n");

        if (randX == firstX && randY == firstY) {
            i--;
            continue;
        }
        if (bombs.findIndex(function (obj) {
            return obj[0] == randX && obj[1] == randY;
        }) != -1) {
            i--;
            continue;
        }
        bombs.push([randX, randY]);
    }

    for (var array of bombs) {
        var x = array[0];
        var y = array[1];
        tiles[x][y].bomb = true;
    }

    for (var x = 0; x < mapSize; x++) {
        for (var y = 0; y < mapSize; y++) {
            clickTile(x, y);
        }
    }
}

function createBounds() {
    for (var x = 0; x < mapSize; x++) {
        for (var y = 0; y < mapSize; y++) {
            var tile = tiles[x][y];
            if (tile.bomb) continue;

            var bombsCounter = 0;
            for (var array of boundsPositions) {
                var xx = x + array[0];
                var yy = y + array[1];

                if(xx < 0 || yy < 0 || xx >= mapSize || yy >= mapSize) continue;
                if (tiles[xx][yy].bomb) bombsCounter++;
            }
            if(bombsCounter != 0) {
                tile.obj.innerHTML = bombsCounter;
                tile.obj.style.color = colors[bombsCounter - 1];
            } 
        }
    }
}

function clickTile(x, y) {
    var tile = tiles[x][y];
    if (!firstClicked) {
        firstX = x;
        firstY = y;

        firstClicked = true;
        createBombs();
        createBounds();
    }

    if (tile.bomb) {
        tile.obj.innerHTML = "<div class='bomb'></div>"
    }
    tile.obj.className = "tile tile-shown bordered";
    tile.obj.removeAttribute("onclick");
}

createTiles();