
Render = class {
    constructor(settings) {
        this.settings = settings;
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

    _renderCell(x, y, cell) {
        if (cell > 0) {
            y -= 1;
            const f = this._cellPoints(x, y, -this.settings.playerHeight);
            const c = this._cellPoints(x, y, this.settings.cellHeight - this.settings.playerHeight);

            Graphics.poly(f.a, f.b, f.c, f.d);
            Graphics.poly(c.a, c.b, c.c, c.d);
        }
    }

    render(player, map) {
        for (let y = 0; y < this.settings.renderCellDistance; y++) {
            for (let x = -this.settings.renderCellWidth; x < this.settings.renderCellWidth + 1; x++) {
                let cellPos;
                switch (player.orient) {
                    case 0:
                        cellPos = { x: player.posX - x, y: player.posY - y};
                        break;
                    case 1:
                        cellPos = { x: player.posX + y, y: player.posY - x};
                        break;
                    case 2:
                        cellPos = { x: player.posX + x, y: player.posY + y};
                        break;
                    case 3:
                        cellPos = { x: player.posX - y, y: player.posY + x};
                        break;
                   
                }
                const cell = map.tile(cellPos.x, cellPos.y);
                this._renderCell(x, -y, cell);
            }
        }
    }
};