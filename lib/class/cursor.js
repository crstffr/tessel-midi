
import {Sequencer} from './sequencer';
import {Launchpad} from './launchpad';

class PlayCursor {

    constructor () {
        this.pos = 0;
        this.state = 'ready';
        this.pads = Launchpad.pads.indexed;
    }

    delay() {
        return Sequencer.stepWait();
    }

    pad() {
        return this.pads[this.pos];
    }

    move(pos) {
        this.pad().flash(false);
        this.pos = pos;
        this.pad().save().setColor('green').flash(true, this.delay());
    }

    pause(index) {
        setTimeout(() => {
            this.pad().save().setColor('green').flash(true);
        }, this.delay() + 200);
    }

    stop() {
        this.pad().flash(false);
        this.pos = 0;
    }


}

export let Cursor = new PlayCursor();