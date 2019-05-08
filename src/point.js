
Point = class {
    constructor(x, y, u, v) {
        this.x = x === 'undefined' ? 0 : x;
        this.y = y === 'undefined' ? 0 : y;
        this.u = u === 'undefined' ? 0 : u;
        this.v = v === 'undefined' ? 0 : v;
    }

    uv(u, v) {
        this.u = u;
        this.v = v;
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