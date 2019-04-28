
Map = class {
    constructor() {
        this.tiles = [];
    }

    tile(x, y) {
        if (y >= 0 && y < this.tiles.length && x >= 0 && x < this.tiles[y].length) {
            return this.tiles[y][x];
        }
        return 0;
    }
}