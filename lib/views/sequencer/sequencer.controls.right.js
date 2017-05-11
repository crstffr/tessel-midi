
import {Controls} from '../../class/controls';

export class SequencerRightControls extends Controls {

    constructor (view) {
        super('right');
        this.view = view;
        this.state = 'ready';

        this.btns = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5,
            stop: this.pads[6],
            play: this.pads[7]
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