import {Utils} from './utils';
import {GridControls} from './controlsGrid';

export class KeyboardControls extends GridControls {

    constructor () {
        super();
        this.octave = 0;
        this.octaveSize = 32;
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