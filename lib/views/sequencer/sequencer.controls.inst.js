
import {RightControls} from '../../class/controlsRight';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';

export class SequencerInstControls extends RightControls {

    constructor () {
        super();

        this.selectPads((pad) => {
            return pad.value < 6;
        });
    }

    selectInstBtn(i) {
        this.iterate((pad) => {
            if (i === pad.value) {
                pad.setColor('amber');
            } else {
                pad.off();
            }
        });
    }

    onClick(pad) {
        this.emit('switchInst', pad.value);
    }

}