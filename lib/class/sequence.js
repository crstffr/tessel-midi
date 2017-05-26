import events from 'events';
import {Step} from './step';
import {Note} from './note';
import {Utils} from './utils';
import {Cursor} from './cursor';
import {Sequencer} from './sequencer';

export class Sequence extends events.EventEmitter {

    constructor() {
        super();

        this.pos = 0;
        this.start = 0;
        this.length = 15;
        this.steps = Array(512).fill().map(() => new Step());

        Sequencer.on('step', () => {
            let step = this.steps[this.pos];
            this.emit('step', this.pos, step);
            this.pos = (this.pos === this.length) ? this.start : this.pos + 1;
        });

        Sequencer.on('stop', () => {
            this.pos = this.start;
            this.emit('reset');
        });
    }

    copyPage(from, to) {
        let start = Utils.getStepIndex(0, to);
        let end = Utils.getStepIndex(63, to);
        let ii = Utils.getStepIndex(0, from);
        for(let i = start; i <= end; i++) {
            let step = this.steps[ii];
            this.steps[i] = (step) ? new Step(step) : null;
            ii++;
        }
    }

    setStart(val) {
        if (val < this.length) {
            this.start = val;
            this.pos = val;
        }
    }

    setLength(val) {
        if (val > this.start) {
            this.length = val;
        }
        if (val < this.pos) {
            this.pos = val;
        }
    }

    assign(i, midi) {
        i = (i === 0) ? this.length : i - 1;
        this.steps[i].active = 1;
        this.steps[i].notes[midi] = new Note(midi);
        console.log('assign', i, midi, this.steps[i].notes[midi]);
    }

    remove(i) {
        this.steps[i].active = 0;
    }

}