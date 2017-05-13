
import {Cursor} from './cursor';
import {Sequence} from './sequence';

export class Instrument {

    constructor () {
        this.midiChannel = 0;
        this.sequence = new Sequence();
        this.moveCursor = Cursor.move.bind(Cursor);
        this.sequence.on('step', this.playStep.bind(this));
    }

    playStep(pos, step) {
        if (step) {
            console.log(step);
        }
    }

    activate() {
        this.sequence.on('step', this.moveCursor);
    }

    deactivate() {
        this.sequence.removeListener('step', this.moveCursor);
    }

}