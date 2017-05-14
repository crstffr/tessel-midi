
import {Controls} from '../../class/controls';
import {Launchpad} from '../../class/launchpad';

export class SequencerTopControls extends Controls {

    constructor () {
        super();
        this.page = 0;
        this.state = 'ready';
        this.pads = Launchpad.pads.top;
        this.btns = {
            0: this.pads['08'],
            1: this.pads['18'],
            2: this.pads['28'],
            3: this.pads['38'],
            4: this.pads['48'],
            5: this.pads['58'],
            6: this.pads['68'],
            7: this.pads['78'],
        };
    }

    selectPageBtn(i) {
        this.page = i;
        this.clearAll();
        this.btns[i].setColor('green');
    }

    showPageInUse(i) {
        this.btns[i].setColor('amber');
    }

    onClick(pad) {
        switch (this.state) {
            case 'ready':
                this.emit('switchPage', pad.x);
                break;

            case 'copy':
                this.emit('copyPage', this.data.pad.x, pad.x);
                pad.save().setColor('amber', 'low').flash(true, 600);
                break;
        }
    }

    onDblClick(pad) {
        this.state = 'delete';
        pad.save().setColor('red').flash(true, 600);
        setTimeout(() => {
            this.emit('clearPage', pad.x);
            this.state = 'ready';
        }, 501);
    }

    onHold(pad) {
        this.data.pad = pad;
        this.state = 'copy';
        pad.flash(true);
    }

    onHoldOff(pad) {
        this.state = 'ready';
        pad.flash(false);
        pad.show();
    }

}