
Map = class {
    constructor() {
        this.tiles = [];
    }

    tile(p) {
        if (p.y >= 0 && p.y < this.tiles.length && p.x >= 0 && p.x < this.tiles[p.y].length) {
            return this.tiles[p.y][p.x];
        }
        return 0;
    }
}