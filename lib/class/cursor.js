
import events from 'events';
import {Utils} from './utils';
import {Sequencer} from './sequencer';
import {Launchpad} from './launchpad';

class PlayCursor extends events.EventEmitter {

    constructor () {
        super();
        this.pos = 0;
        this.page = 0;
        this.state = 'ready';
        this.pads = Launchpad.pads.indexed;
    }

    delay() {
        return Sequencer.stepWait();
    }

    pad() {
        return this.pads[this.pos];
    }

    move(padIndex) {
        this.pad().flash(false);
        this.pos = padIndex;
        this.pad().save().setColor('green', 'full').flash(true, this.delay());
    }

    pause() {
        setTimeout(() => {
            this.pad().save().setColor('green', 'full').flash(true);
        }, this.delay() + 200);
    }

    stop() {
        this.pad().flash(false);
        this.pos = 0;
    }


}

export let Cursor = new PlayCursor();