import events from 'events';
import {Step} from './step';
import {Utils} from './utils';
import {Sequencer} from './sequencer';

export class Sequence extends events.EventEmitter {

    constructor() {
        super();

        this.step = 0;
        this.length = 15;
        this.steps = Array(512).fill(null);

        Sequencer.on('step', () => {
            let step = this.steps[this.step];
            let pagePad = Utils.getPagePadIndex(this.step);
            this.emit('step', pagePad.page, pagePad.pad, this.step, step);
            this.step = (this.step === this.length) ? 0 : this.step + 1;
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