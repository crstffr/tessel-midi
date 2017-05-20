import {Controls} from '../../class/controls';

export class AssignOctaveControls extends Controls {

    constructor () {
        super();

        this.pads = {};

        // Just select the first row out of the grid for pads
        Object.keys(this.device.pads.grid).forEach((key) => {
            if (Number(key[1]) === 0) {
                this.pads[key] = this.device.pads.grid[key];
            }
        });

        this.btns = {
            1: this.pads['00'],
            2: this.pads['01'],
            3: this.pads['02'],
            4: this.pads['03'],
            5: this.pads['04'],
            6: this.pads['05'],
            7: this.pads['06'],
            8: this.pads['07'],
        };
    }

    renderSelection(val) {
        this.iterate((pad) => {
            if (pad.i === val) {
                pad.setColor('green');
            } else {
                pad.setColor('amber');
            }
        });
    }

    onActivate() {

    }

    onClick(pad) {
        this.emit('setOctave', pad.x);
    }

}