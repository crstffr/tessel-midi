
import {Controls} from '../../class/controls';

export class SequencerTopControls extends Controls {

    constructor (view) {
        super('top');
        this.view = view;
        this.state = 'ready';
    }

    handleClick(pad) {
        switch (this.state) {
            case 'ready':
                this.clearAll();
                pad.setColor('green', 'low');
                this.view.switchToPage(pad.x);
                break;

            case 'copy':
                this.view.copyPage(this.data.pad.x, pad.x);
                pad.setColor('amber', 'low').flash(true, 500);
                break;
        }

        this.view.pages.forEach(() => {

        })

    }

    handleHold(pad) {
        this.data.pad = pad;
        this.state = 'copy';
        pad.flash(true);
    }

    handleHoldRelease(pad) {
        this.state = 'ready';
        pad.flash(false);
        pad.show();
    }

}