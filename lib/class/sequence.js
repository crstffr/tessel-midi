import events from 'events';
import {Step} from './step';
import {Utils} from './utils';
import {Sequencer} from './sequencer';

export class Sequence extends events.EventEmitter {

    constructor() {
        super();

        this.pos = 0;
        this.length = 15;
        this.steps = Array(512).fill(null);

        Sequencer.on('step', () => {
            let step = this.steps[this.pos];
            let pagePad = Utils.getPagePadIndex(this.pos);
            this.emit('step', this.pos, step);
            this.pos = (this.pos === this.length) ? 0 : this.pos + 1;
        });

        Sequencer.on('stop', () => {
            this.pos = 0;
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