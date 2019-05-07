
Player = class {
    constructor() {
        this.posX = 1;
        this.posY = 1;
        this.orientation = 2;
    }

    turnLeft() {
        this.orientation -= 1;
        if (this.orientation  < 0) {
            this.orientation = 3;
        }
    }

    turnRight() {
        this.orientation += 1;
        if (this.orientation  > 3) {
            this.orientation = 0;
        }
    }

    moveForward(map) {
        this._go(map, 1);
    }

    moveBackward(map) {
        this._go(map, -1);
    }

    _go(map, step) {
        switch(this.orientation) {
            case 0: 
                if (map.tile(this.posX, this.posY - step) > 0) {
                    this.posY -= step;
                }
                break;
            case 1: 
                if (map.tile(this.posX + step, this.posY) > 0) {
                    this.posX += step;
                }
                break;
            case 2: 
                if (map.tile(this.posX, this.posY + step) > 0) {
                    this.posY += step;
                }
                break;
            case 3: 
                if (map.tile(this.posX - step, this.posY) > 0) {
                    this.posX -= step;
                }
                break;
        }
    }
}