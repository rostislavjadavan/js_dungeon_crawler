
Point = class {
    constructor(x, y) {
        this.x = x === 'undefined' ? 0 : x;
        this.y = y === 'undefined' ? 0 : y;
    }

    add(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    addPoint(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    clone() {
        return new Point(this.x, this.y);
    }
}