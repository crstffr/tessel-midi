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
        this.resetCursorBound = this.resetCursor.bind(this);
        this.sequence.on('step', this.onStep.bind(this));
    }

    activate() {
        this.sequence.on('step', this.moveCursorBound);
        this.sequence.on('reset', this.resetCursorBound);
    }

    deactivate() {
        this.sequence.removeListener('step', this.moveCursorBound);
        this.sequence.removeListener('reset', this.resetCursorBound);
    }

    resetCursor() {
        Cursor.move(this.sequence.start);
    }

    moveCursor(stepIndex) {
        let pp = Utils.getPagePadIndex(stepIndex);
        Cursor.move(pp.pad);
        if (pp.page !== this.page) {
            this.emit('switchPage', pp.page);
        }
    }

    playNote(note, step) {
        let vel = step.getVelocity();
        let len = step.getLength();
        Midi.play(note, vel, len, this.channel);
    }

    playStep(step) {
        if (step) {
            Object.keys(step.notes).forEach((note) => {
                this.playNote(note, step);
            });
        }
    }

    onStep(pos, step) {
        this.playStep(step);
    }

    switchPage(i) {
        this.page = i;
        Stream.send('set.instrument.page', {id: this.id, page: i});
    }





}