import {Controls} from '../../class/controls';
import {RightControls} from '../../class/controlsRight';

export class AssignOctaveControls extends RightControls {

    constructor () {
        super();

        this.selectPads((pad, key) => {
            return pad.value < 3;
        });

    }

    renderSelection(val) {
        this.iterate((pad) => {
            if (pad.value === val) {
                pad.setColor('green');
            } else {
                pad.setColor('amber');
            }
        });
    }

    onActivate() {

    }

    onClick(pad) {
        this.emit('setOctave', pad.value);
    }

}