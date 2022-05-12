const tileSize = 50;
const mapSize = 9;

var container = getId("container");
var firstClicked = false;

var firstX = -1;
var firstY = -1;

const size = tileSize * mapSize;
const tiles = [];
const bombs = [];

container.style.width = size + "px";
container.style.height = size + "px";

function createTiles() {
    for (var x = 0; x < mapSize; x++) {
        tiles[x] = [];
        for (var y = 0; y < mapSize; y++) {
            var div = document.createElement("div");
            div.className = "tile tile-hidden";
            div.setAttribute("onclick", `clickTile(${x}, ${y});`);
            container.appendChild(div);

            tiles[x][y] = {
                xPos: x,
                yPos: y,

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

        if(randX == firstX && randY == firstY) {
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

    for(var array of bombs) {
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

function clickTile(x, y) {
    var tile = tiles[x][y];
    if (!firstClicked) {
        firstX = x;
        firstY = x;

        firstClicked = true;
        createBombs();
    }

    if(tile.bomb) {
        tile.obj.innerHTML = "<div class='bomb'></div>"
    }
    tile.obj.className = "tile tile-shown";
    tile.obj.removeAttribute("onclick");
}

createTiles();