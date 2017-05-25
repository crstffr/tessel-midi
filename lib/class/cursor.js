
import events from 'events';
import {Utils} from './utils';
import {Sequencer} from './sequencer';
import {Launchpad} from './launchpad';
import {CursorControls} from './controlsCursor';

class PlayCursor extends CursorControls {

    constructor () {
        super();
        this.pads = Launchpad.pads.indexed;
    }

    pad() {
        return this.pads[this.pos];
    }

    setPadState(state) {
        this.padState = state;
        return this;
    }

    show() {
        this.pad().load(this.padState);
        return this;
    }

    hide() {
        this.pad().load('off');
    }

    move(i) {
        this.pad().loadPrev();
        this.pos = i;
        this.pad().load(this.padState);
        return this;
    }

    stepState() {
        this.setPadState('step').show();
        return this;
    }

    playState() {
        this.setPadState('cursorPlay').show();
        return this;
    }

    recordState() {
        this.setPadState('cursorRecord').show();
        return this;
    }

}

export let Cursor = new PlayCursor();