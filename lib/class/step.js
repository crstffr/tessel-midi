
import {Sequencer} from './sequencer';

export class Step {

    constructor (data) {
        data = data || {};
        this.length = 7;
        this.velocity = 7;
        this.notes = data.notes || {};
    }

    getLength() {
        return Sequencer.stepWait(this.length);
    }

    getVelocity() {
        return Math.ceil((127 / 7) * this.velocity);
    }



}