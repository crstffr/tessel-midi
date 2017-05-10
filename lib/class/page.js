
import {Launchpad} from './launchpad';
import {Pad} from './pad';

export class Page {

    constructor (id) {

        this.id = id;
        this.pads = [];
        this.active = false;

        Array(8).fill().forEach((v,x) => {
            this.pads[x] = [];
            Array(8).fill().forEach((v,y) => {
                this.pads[x][y] = new Pad(x,y, this);
            });
        });

        this.pads.forEach((row) => {
            row.forEach((pad) => {
                pad.onClick(() => {
                    this.handleClick(pad);
                });
            });
        });

    }

    activate () {
        //console.log('Activate Page: ', this.name);
        this.active = true;
        this.pads.forEach((row) => {
            row.forEach((pad) => {
                pad.show();
            });
        });
    }

    deactivate () {
        //console.log('Dectivate Page: ', this.name);
        this.active = false;
        this.pads.forEach((row) => {
            row.forEach((pad) => {
                pad.hide();
            });
        });
    }

    copyPadsFrom(page) {

    }

    handleClick () {
        // stub, to be provided by extenders
    }

    handleHold () {

    }

    handleHoldRelease () {

    }

    getPad (k) {
        return this.pads[k.x][k.y];
    }

}