import {Launchpad} from './launchpad';
import {Pad} from './pad';

export class Controls {

    constructor(position) {

        this.view = false;
        this.data = {};
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
            pad.onHold(() => {
                this.handleHold(pad);
            });
            pad.onHoldRelease(() => {
                this.handleHoldRelease(pad);
            });
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

    handleHold () {
        // stub, to be provided by extenders
    }

    handleHoldRelease() {
        // stub, to be provided by extenders
    }

    clearAll () {
        this.pads.forEach((pad) => {
            pad.off();
        });
    }

}