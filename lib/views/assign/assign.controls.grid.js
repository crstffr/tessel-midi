import {GridControls} from '../../class/controlsGrid';

export class AssignGridControls extends GridControls {

    constructor () {
        super();

        this.pads = {};

        // Just select the first row out of the grid for pads
        Object.keys(this.device.pads.grid).forEach((key) => {
            if (Number(key[1]) > 0) {
                this.pads[key] = this.device.pads.grid[key];
            }
        });

    }

    renderNotes(notes) {
        Object.keys(notes).forEach((key) => {
            let note = notes[key];
            this.device.pads.indexed[Number(key) + 8].setColor('amber');
        })
    }

    onClick(pad) {
        this.emit('assignNote', pad.i - 8, pad.toggle('amber'));
    }

}