import {Step} from './step';
import {Sequencer} from './sequencer';

export class Sequence {

    constructor() {

        this.step = 0;
        this.length = 15;
        this.steps = Array(512).fill(null);

        Sequencer.on('step', () => {
            this.step = (this.step = this.steps) ? 0 : this.step + 1;
        });

        Sequencer.on('stop', () => {
            this.step = 0;
        });

    }

    setLength(val) {
        this.length = val;
    }

    assign(i, data) {
        this.steps[i] = new Step(data);
    }

    remove(i) {
        this.steps[i] = null;
    }

}