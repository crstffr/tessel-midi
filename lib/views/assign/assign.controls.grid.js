import {GridControls} from '../../class/controlsGrid';

export class AssignGridControls extends GridControls {

    constructor () {
        super();
        this.octave = 0;
        this.octaveSize = 32; // not real "octave" obv
    }

    renderNotes(notes) {
        this.iterate((pad) => {
            let key = this.getOffset(pad.value);
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
        this.emit('pressPad', pad, this.getOffset(pad.value));
    }

    onRelease(pad) {
        this.emit('releasePad', pad, this.getOffset(pad.value));
    }

    getOffset(i) {
        return 127 - (Number(i) + (this.octave * this.octaveSize));
    }

}