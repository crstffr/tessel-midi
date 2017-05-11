
import {Launchpad} from './launchpad';
import {Pad} from './pad';

export class Page {

    constructor (id) {

        this.id = id;
        this.pads = [];
        this.active = false;
        this.populated = false;

        Array(8).fill().forEach((v,x) => {
            this.pads[x] = [];
            Array(8).fill().forEach((v,y) => {
                this.pads[x][y] = new Pad(x,y, this);
            });
        });

        this.iteratePads((pad) => {
            pad.onClick(() => {
                this.handleClick(pad);
            });
        });
    }

    activate () {
        this.active = true;
        this.pads.forEach((row) => {
            row.forEach((pad) => {
                pad.show();
            });
        });
    }

    deactivate () {
        this.active = false;
        this.pads.forEach((row) => {
            row.forEach((pad) => {
                pad.hide();
            });
        });
    }

    clearPads () {
        this.iteratePads((pad) => {
            pad.off();
        })
    }

    iteratePads (fn) {
        this.pads.forEach((row) => {
            row.forEach(fn);
        })
    }

    copyPadsFrom(page) {
        this.iteratePads((pad) => {
            pad.copySettingsFrom(page.pads[pad.x][pad.y]);
        });
    }

    getPad (k) {
        return this.pads[k.x][k.y];
    }

    // Abstracts, stubs, whatever.

    handleClick () {}

    handleHold () {}

    handleHoldRelease () {}

}