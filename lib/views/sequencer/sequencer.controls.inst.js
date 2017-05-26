
import {RightControls} from '../../class/controlsRight';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';

export class SequencerInstControls extends RightControls {

    constructor () {
        super();

        this.selectPads((pad) => {
            return pad.value < 6;
        });

        this.iterate((pad) => {
            pad.define({
                instSelected: {
                    color: 'amber'
                },
                instSetup: {
                    color: 'amber',
                    flash: true
                }
            });
        })
    }

    selectInstBtn(i) {
        this.iterate((pad) => {
            if (i === pad.value) {
                pad.load('instSelected');
            } else {
                pad.off();
            }
        });
    }

    onClick(pad) {
        this.emit('switchInst', pad.value);
    }

    onHold(pad) {
        this.emit('startChannelCapture', pad.value);
        pad.load('instSetup');
    }

    onHoldOff(pad) {
        pad.loadPrev();
        console.log('inst stop capture');
        this.emit('stopCapture');
    }

}