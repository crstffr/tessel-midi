
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';
import {PlayControls} from '../../class/controlsPlay';

export class SequencerPlayControls extends PlayControls {

    constructor () {
        super();

        this.on('playHold', () => {
            this.emit('startLengthCapture');
        });

        this.on('playHoldOff', () => {
            this.emit('stopCapture');
        });

    }

}