
Player = class {
    constructor() {
        this.pos = new Point(1, 1);
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
        let newPos = this.pos.clone();
        switch(this.orientation) {
            case 0: 
                newPos.add(0, -step);
                break;
            case 1: 
                newPos.add(step, 0);
                break;
            case 2: 
                newPos.add(0, step);
                break;
            case 3: 
                newPos.add(-step, 0);
                break;
        }
        if (map.tile(newPos) > 0) {
            this.pos = newPos;
        }
    }
}