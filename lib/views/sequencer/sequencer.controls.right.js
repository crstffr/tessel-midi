
import {Controls} from '../../class/controls';
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

        this.tempo = 120;
        this.mstempo = 1000 / (this.tempo / 60);


    }

    handleClick(pad) {
        switch(pad.y) {
            case 7:
                this.playPause();
                break;
            case 6:
                this.stop();
                break;
            default:
                this.selectView(pad);
                break;
        }
    }

    playPause() {
        let btn = this.btns.play;
        switch (this.state) {
            case 'ready':
                btn.setColor('green').flash(true, 0, this.mstempo);
                this.state = 'playing';
                break;
            case 'playing':
                btn.setColor('amber').flash(false);
                this.state = 'ready';
                break;
        }
    }

    stop() {
        this.btns.play.flash(false).setColor('green');
        this.state = 'ready';
    }

    selectView(pad) {
        this.clearViewSelectors();
        pad.setColor('red');
    }

    clearViewSelectors() {
        this.pads.forEach((pad) => {
            if (pad.y < 6) {
                pad.off();
            }
        })
    }

}