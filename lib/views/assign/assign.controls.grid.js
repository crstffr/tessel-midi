import {GridControls} from '../../class/controlsGrid';

export class AssignGridControls extends GridControls {

    constructor () {
        super();

        this.pads = {};
        this.octave = 0;
        this.octaveSize = 16; // not real "octave"

        // Select all but the first row (which are used for octaves)
        Object.keys(this.device.pads.grid).forEach((key) => {
            if (Number(key[1]) > 0) {
                this.pads[key] = this.device.pads.grid[key];
            }
        });
    }

    renderNotes(notes) {
        this.iterate((pad) => {
            let key = this.getOffset(pad.i);
            if (notes[key]) {
                pad.setColor('amber');
            } else {
                pad.off();
            }
        });
    }

    setOctave(val) {
        this.octave = val;
    }

    onPress(pad) {
        pad.setColor('amber');
        this.emit('playNote', this.getOffset(pad.i));
    }

    onRelease(pad) {
        pad.off();
    }

    getOffset(i) {
        return (Number(i) - 8) + (this.octave * this.octaveSize);
    }

}