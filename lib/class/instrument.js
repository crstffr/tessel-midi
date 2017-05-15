import events from 'events';
import {Midi} from './midi';
import {Utils} from './utils';
import {Cursor} from './cursor';
import {Sequence} from './sequence';

export class Instrument extends events.EventEmitter {

    constructor (channel) {
        super();
        this.page = 0;
        this.channel = channel;
        this.sequence = new Sequence();
        this.moveCursorBound = this.moveCursor.bind(this);
        this.sequence.on('step', this.playStep.bind(this));
    }

    playStep(pos, step) {
        if (step) {
            Midi.play(51);
        }
    }

    switchPage(i) {
        this.page = i;
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
    }

    deactivate() {
        this.sequence.removeListener('step', this.moveCursorBound);
    }

}