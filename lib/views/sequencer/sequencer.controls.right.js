
import {Controls} from '../../class/controls';

export class SequencerRightControls extends Controls {

    constructor (view) {
        super('right');
        this.view = view;
    }

    handleClick(pad) {
        this.clearAll();
        pad.setColor('red', 'low');
    }

}