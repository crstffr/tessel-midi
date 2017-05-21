import {Pad} from './pad';
import LaunchpadMini from 'launchpad-mini';

class MyLaunchpad extends LaunchpadMini {

    constructor () {
        super();

        this.pads = {
            all: {},
            grid: {},
            top: {},
            right: {},
            indexed: {}
        };

        this._buttons.forEach((btn) => {

            let pad = new Pad(btn, this);
            let xy = MyLaunchpad.getXY(btn);

            this.pads.all[xy] = pad;
            this.pads.indexed[pad.i] = pad;

            if (pad.x === 8) {
                pad.value = pad.y;
                this.pads.right[xy] = pad;
            }
            if (pad.y === 8) {
                pad.value = pad.x;
                this.pads.top[xy] = pad;
            }
            if (pad.x < 8 && pad.y < 8) {
                pad.value = pad.i;
                this.pads.grid[xy] = pad;
            }
        });

        this.on('key', (k) => {
            let xy = MyLaunchpad.getXY(k);
            this.pads.all[xy].emit((k.pressed) ? 'press' : 'release');
        });

    }

    static getXY(k) {
        return String(k.x) + String(k.y);
    }

}

export let Launchpad = new MyLaunchpad();

