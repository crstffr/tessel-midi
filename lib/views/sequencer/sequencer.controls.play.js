
import {RightControls} from '../../class/controlsRight';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';

export class SequencerPlayControls extends RightControls {

    constructor () {
        super();

        this.selectPads((pad) => {
            return pad.value >= 6;
        });

        this.btns.stop = this.btns.G;
        this.btns.play = this.btns.H;
    }

    onActivate() {
        this.btns.play.setColor('green');
        this.btns.stop.setColor('red');
    }

    onClick(pad) {
        switch(pad) {
            case this.btns.play:
                this.playPause();
                break;
            case this.btns.stop:
                this.stop();
                break;
        }
    }

    onHold(pad) {
        if (pad === this.btns.play) {
            this.emit('startLengthCapture');
        }
        if (pad === this.btns.stop) {
            this.emit('reset');
        }
    }

    onHoldOff(pad) {
        if (pad === this.btns.play) {
            this.emit('stopLengthCapture');
        }
    }

    playPause() {
        let btn = this.btns.play;
        switch (Sequencer.state) {
            case 'paused':
            case 'stopped':
                this.emit('play');
                btn.setColor('green').flash(true, 0, Sequencer.stepWait());
                break;
            case 'playing':
                this.emit('pause');
                btn.setColor('amber').flash(false);
                break;
        }
    }

    stop() {
        this.btns.play.flash(false).setColor('green');
        this.emit('stop');
    }

}