
import {TopControls} from '../../class/controlsTop';
import {Launchpad} from '../../class/launchpad';

export class SequencerTopControls extends TopControls {

    constructor () {
        super();
        this.page = 0;
    }

    selectPageBtn(i) {
        this.page = i;
        this.clearAll();
        this.btns[i + 1].setColor('green');
    }

    showPageInUse(i) {
        this.btns[i + 1].setColor('amber');
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