
import {Sequencer} from './sequencer';

export class Step {

    constructor (data) {
        data = data || {};
        this.active = 0;
        this.length = 7;
        this.velocity = 7;
        this.notes = data.notes || {};
    }

    hasNotes() {
        return Object.keys(this.notes).length > 0;
    }

    getLength() {
        return Sequencer.stepWait(this.length);
    }

    getVelocity() {
        return Math.ceil((127 / 7) * this.velocity);
    }



}