
import {TopControls} from '../../class/controlsTop';
import {Launchpad} from '../../class/launchpad';

export class SequencerPageControls extends TopControls {

    constructor () {
        super();
        this.selected = 0;
    }

    selectPageBtn(i) {
        this.clearAll();
        this.selected = i;
        this.btns[i + 1].setColor('green');
    }

    showPageInUse(i) {
        this.btns[i + 1].setColor('amber');
    }

    onClick(pad) {
        switch (this.state) {
            case 'ready':
                this.emit('switchPage', pad.value);
                break;

            case 'copy':
                this.emit('copyPage', this.data.pad.value, pad.value);
                pad.save().setColor('amber', 'low').flash(true, 600);
                break;
        }
    }

    onDblClick(pad) {
        this.state = 'delete';
        pad.save().setColor('red').flash(true, 600);
        setTimeout(() => {
            this.emit('clearPage', pad.value);
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