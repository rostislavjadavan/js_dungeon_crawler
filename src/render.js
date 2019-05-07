
Render = class {
    constructor(settings, map, player) {
        this.settings = settings;
        this.map = map;
        this.player = player;
    }

    _transform(p) {
        const r = this.settings.distance / p.z;
        return {
            x: this.settings.windowWidth / 2 + r * p.x,
            y: this.settings.windowHeight / 2 + r * p.y
        }
    };

    _cellPoints(x, y, height) {
        return {
            a: this._transform({
                x: (x - 0.5) * this.settings.cellSize,
                y: height,
                z: (y - 0.5) * this.settings.cellSize
            }),
            b: this._transform({
                x: (x + 0.5) * this.settings.cellSize,
                y: height,
                z: (y - 0.5) * this.settings.cellSize
            }),
            c: this._transform({
                x: (x + 0.5) * this.settings.cellSize,
                y: height,
                z: (y + 0.5) * this.settings.cellSize
            }),
            d: this._transform({
                x: (x - 0.5) * this.settings.cellSize,
                y: height,
                z: (y + 0.5) * this.settings.cellSize
            })
        }
    }

    _renderCell(x, y, cellPos) {
        const cell = this.map.tile(cellPos);
        if (cell > 0) {
            y -= 1;
            const f = this._cellPoints(x, y, -this.settings.playerHeight);
            const c = this._cellPoints(x, y, this.settings.cellHeight - this.settings.playerHeight);

            Graphics.poly(f.a, f.b, f.c, f.d);
            Graphics.poly(c.a, c.b, c.c, c.d);
        }
    }

    render() {
        for (let y = this.settings.renderCellDistance; y >= 0; y--) {
            for (let x = -this.settings.renderCellWidth; x < this.settings.renderCellWidth + 1; x++) {
                this._renderCell(x, -y, this._cellMapRenderPlayerPosition(x, y));
            }
        }
    }

    _cellMapRenderPlayerPosition(x, y) {
        let newPos = this.player.pos.clone();
        switch (this.player.orientation) {
            case 0:
                return newPos.add(-x, -y);
            case 1:
                return newPos.add(y, -x);
            case 2:
                return newPos.add(x, y);
            case 3:
                return newPos.add(-y, x);
        }
    }
};