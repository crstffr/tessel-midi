import {Launchpad} from './launchpad';
import {Pad} from './pad';

export class Controls {

    constructor(position) {

        this.view = false;
        this.state = '';
        this.active = false;

        this.pads = Array(8).fill().map((v, i) => {
            let pad;
            switch (position) {
                case 'top':
                    pad = new Pad(i, 8, this);
                    break;
                case 'right':
                    pad = new Pad(8, i, this);
                    break;
            }
            return pad;
        });

        this.pads.forEach((pad) => {
            pad.onClick(() => {
                this.handleClick(pad);
            });
        });

        Launchpad.on('key', (k) => {
            if (this.active && k.pressed) {
                if (position === 'top' && k.y === 8) {
                    this.pads[k.x].click(k);
                }
                if (position === 'right' && k.x === 8) {
                    this.pads[k.y].click(k);
                }
            }
        });

    }

    activate () {
        this.active = true;
    }

    deactivate () {
        this.active = false;
    }

    handleClick () {
        // stub, to be provided by extenders
    }

    clearAll () {
        this.pads.forEach((pad) => {
            pad.off();
        });
    }

}