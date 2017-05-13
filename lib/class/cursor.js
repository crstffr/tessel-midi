
import {Sequencer} from './sequencer';
import {Launchpad} from './launchpad';

export class Cursor {

    constructor () {
        this.index = 0;
        this.state = 'ready';
        this.pads = Launchpad.pads.indexed;
    }

    delay() {
        return Sequencer.stepWait();
    }

    pad() {
        return this.pads[this.index];
    }

    move(index) {
        this.pad().flash(false);
        this.index = index;
        this.pad().save().setColor('green').flash(true, this.delay());
    }

    pause(index) {
        setTimeout(() => {
            this.pad().save().setColor('green').flash(true);
        }, this.delay() + 200);
    }

    stop() {
        this.pad().flash(false);
        this.index = 0;
    }


}