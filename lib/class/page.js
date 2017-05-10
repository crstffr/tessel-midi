
import {Launchpad} from './launchpad';
import {Pad} from './pad';

export class Page {

    constructor (name) {

        this.pads = [];
        this.name = name;
        this.active = false;

        Array(8).fill().forEach((v,x) => {
            this.pads[x] = [];
            Array(8).fill().forEach((v,y) => {
                this.pads[x][y] = new Pad(x,y, this);
            });
        });

        this.pads.forEach((row) => {
            row.forEach((pad) => {
                pad.onClick(this.handleClick);
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

    handleClick () {
        // stub, to be provided by extenders
    }

    getPad (k) {
        return this.pads[k.x][k.y];
    }

}