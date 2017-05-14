
import {Controls} from '../../class/controls';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';

export class SequencerRightControls extends Controls {

    constructor () {
        super();
        this.state = 'ready';
        this.pads = Launchpad.pads.right;
        this.btns = {
            A: this.pads['80'],
            B: this.pads['81'],
            C: this.pads['82'],
            D: this.pads['83'],
            E: this.pads['84'],
            F: this.pads['85'],
            stop: this.pads['86'],
            play: this.pads['87'],
        };

        this.btns.play.setColor('green');
        this.btns.stop.setColor('red');
    }

    selectInstBtn(i) {
        let xy = String(8) + i;
        this.iterate((pad) => {
            if (pad.y < 6) {
                pad.off();
            }
        });
        this.pads[xy].setColor('amber');
    }

    onClick(pad) {
        switch(pad) {
            case this.btns.play:
                this.playPause();
                break;
            case this.btns.stop:
                this.stop();
                break;
            default:
                this.emit('switchInst', pad.y);
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