const tileSize = 50;
const mapSize = 9;

var container = getId("container");
var firstClicked = false;

const size = tileSize * mapSize;
const tiles = [];
const bombs = [];

container.style.width = size + "px";
container.style.height = size + "px";

for(var x = 0; x < mapSize; x++) {
    tiles[x] = [];
    for(var y = 0; y < mapSize; y++) {
        var div = document.createElement("div");
        div.className = "tile tile-hidden";
        div.setAttribute("onclick", `clickTile(${x}, ${y});`);
        container.appendChild(div);

        tiles[x][y] = {
            obj: div
        };
    }
}

function createBombs() {
    for(var i = 0; i < 10; i++) {
        var randX = getRandom(0, 9);
        var randY = getRandom(0, 9);

        if(bombs.findIndex(function(obj) {
            return obj.x == randX && obj.y == randY;
        }) != -1) {
            i--;
            continue;
        }
        bombs.push([randX, randY]);
    }

    for(var array of bombs) {
        console.log(array);
    }
}

function clickTile(x, y) {
    var tile = tiles[x][y];
    if(!firstClicked) {
        firstClicked = true;
        createBombs();
    }

    tile.obj.className = "tile tile-shown";
    tile.obj.removeAttribute("onclick");
}

for(var x = 0; x < mapSize; x++) {
    for(var y = 0; y < mapSize; y++) {
        clickTile(x, y);
    }
}