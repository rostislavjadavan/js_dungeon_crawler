
Render = class {
    constructor(settings, map, player) {
        this.settings = settings;
        this.map = map;
        this.player = player;
    }

    render() {
        for (let y = this.settings.renderCellDistance; y >= 0; y--) {
            for (let x = -this.settings.renderCellWidth; x < this.settings.renderCellWidth + 1; x++) {
                this._renderCell(x, y, this._cellMapRenderPlayerPosition(x, y));
            }
        }
    }

    _transform(p, u, v) {
        const r = this.settings.distance / -p.z;
        return new Point(
            this.settings.windowWidth / 2 + r * p.x,
            this.settings.windowHeight / 2 + r * p.y,
            u,
            v
        );
    };

    _cellPoints(x, y, height) {
        return {
            a: this._transform({
                x: (x - 0.5) * this.settings.cellSize,
                y: height,
                z: (y - 0.5) * this.settings.cellSize
            }, 0, 0),
            b: this._transform({
                x: (x + 0.5) * this.settings.cellSize,
                y: height,
                z: (y - 0.5) * this.settings.cellSize
            }, 800, 0),
            c: this._transform({
                x: (x + 0.5) * this.settings.cellSize,
                y: height,
                z: (y + 0.5) * this.settings.cellSize
            }, 800, 600),
            d: this._transform({
                x: (x - 0.5) * this.settings.cellSize,
                y: height,
                z: (y + 0.5) * this.settings.cellSize
            }, 0, 600)
        }
    }

    _renderCell(x, y, cellPos) {
        const cell = this.map.tile(cellPos);
        if (cell > 0) {

            const f = this._cellPoints(x, y + 1, -this.settings.playerHeight);
            const c = this._cellPoints(x, y + 1, this.settings.cellHeight - this.settings.playerHeight);

            const tex = {
                floor: this.assets.image('metal02.jpg'),
                ceil:  this.assets.image('metal04.jpg'),
                wall: this.assets.image('metal03.jpg')
            }
            //Graphics.poly(f.a, f.b, f.c, f.d);
            //Graphics.poly(c.a, c.b, c.c, c.d);
            Graphics.texture(tex.floor, [f.a, f.b, f.c, f.d]);
            Graphics.texture(tex.ceil, [c.a, c.b, c.c, c.d]);

            const color = "rgba(0, 0, 0, " + (y / 6) + ")";
            Graphics.polyFill(f.a, f.b, f.c, f.d, color);
            Graphics.polyFill(c.a, c.b, c.c, c.d, color);

            let frontCell = this.map.tile(this._cellMapRenderPlayerPosition(x, y + 1));
            if (frontCell == 0) {
                //Graphics.poly(f.c, f.d, c.d, c.c);
                f.c.uv(0, 0);
                f.d.uv(800, 0);
                c.d.uv(800, 600);
                c.c.uv(0, 600);
                Graphics.texture(tex.wall, [f.c, f.d, c.d, c.c]);
                Graphics.polyFill(f.c, f.d, c.d, c.c, color);
            }
            let rightCell = this.map.tile(this._cellMapRenderPlayerPosition(x - 1, y));
            if (rightCell == 0) {
                //Graphics.poly(f.a, f.d, c.d, c.a);
                f.a.uv(0, 0);
                f.d.uv(800, 0);
                c.d.uv(800, 600);
                c.a.uv(0, 600);
                Graphics.texture(tex.wall, [f.a, f.d, c.d, c.a]);
                Graphics.polyFill(f.a, f.d, c.d, c.a, color);
            }
            let leftCell = this.map.tile(this._cellMapRenderPlayerPosition(x + 1, y));
            if (leftCell == 0) {
                //Graphics.poly(f.b, f.c, c.c, c.b);
                f.b.uv(0, 0);
                f.c.uv(800, 0);
                c.c.uv(800, 600);
                c.b.uv(0, 600);
                Graphics.texture(tex.wall, [f.b, f.c, c.c, c.b]);
                Graphics.polyFill(f.b, f.c, c.c, c.b, color);
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