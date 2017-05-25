
import events from 'events';
import {Utils} from './utils';
import {Sequencer} from './sequencer';
import {Launchpad} from './launchpad';
import {CursorControls} from './controlsCursor';

class PlayCursor extends CursorControls {

    constructor () {
        super();

        this.timer = 0;
        this.pads = Launchpad.pads.indexed;
        Sequencer.on('record', this.record.bind(this));
        Sequencer.on('pause', this.pause.bind(this));
        Sequencer.on('stop', this.stop.bind(this));
        Sequencer.on('play', this.play.bind(this));

    }

    setPadState(state) {
        this.padState = state;
        return this;
    }

    pad() {
        return this.pads[this.pos];
    }

    show() {
        this.pad().load(this.padState);
        return this;
    }

    move(i) {
        this.pad().loadPrev();
        this.pos = i;
        this.pad().load(this.padState);
        return this;
    }

    play() {
        this.padState = 'cursorPlay';
        return this;
    }

    pause() {
        return this;
    }

    stop() {
        return this;
    }

    record() {
        this.padState = 'cursorRecord';
        return this;
    }

    reset() {
        this.pad().loadPrev();
        return this;
    }

}

export let Cursor = new PlayCursor();