import events from 'events';
import {Midi} from './midi';
import {Utils} from './utils';
import {Event} from './event';
import {Cursor} from './cursor';
import {uid} from '../utils/uid';
import {Sequence} from './sequence';
import {Stream} from './eventStream';

export class Instrument extends events.EventEmitter {

    constructor (channel) {
        super();
        this.id = uid();
        this.page = 0;
        this.channel = channel;
        this.sequence = new Sequence();
        this.moveCursorBound = this.moveCursor.bind(this);
        this.sequence.on('step', this.onStep.bind(this));
    }

    play(step) {
        if (step) {
            console.log(step);
        }
    }

    onStep(pos, step) {
        this.play(step);
    }

    switchPage(i) {
        this.page = i;
        Stream.send('set.instrument.page', {id: this.id, page: i});
    }

    moveCursor(stepIndex) {
        let pagePad = Utils.getPagePadIndex(stepIndex);
        Cursor.move(pagePad.pad);
        if (pagePad.page !== this.page) {
            this.emit('switchPage', pagePad.page);
        }
    }

    activate() {
        this.sequence.on('step', this.moveCursorBound);
        Stream.send('set.instrument', {id: this.id});
    }

    deactivate() {
        this.sequence.removeListener('step', this.moveCursorBound);
    }

}