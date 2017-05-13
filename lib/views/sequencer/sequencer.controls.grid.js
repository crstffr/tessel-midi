
import {Controls} from '../../class/controls';
import {Launchpad} from '../../class/launchpad';

export class SequencerGridControls extends Controls {

    constructor () {
        super();
        this.pads = Launchpad.pads.grid;
    }

    renderSeqLength(seq, bool) {
        this.iterate((pad) => {
            if (pad.i <= seq.length) {
                pad.setColor('green');
            } else {
                pad.off();
            }
        });
    }

    renderSeqSteps(seq, page) {
        this.clearAll();
        this.iterate((pad) => {
            let step = (page * 63) + pad.i;
            if (seq.steps[step]) {
                pad.setColor('amber');
            }
        });
    }

    onClick(pad) {
        switch(this.state) {
            case 'ready':
                this.emit('assignStep', pad, pad.toggle('amber'));
                break;
            case 'length':
                this.emit('setLength', pad);
                break;
        }

    }

    onDblClick(pad) {

    }

    onHold(pad) {
        if (pad.xy === '00') {
            this.state = 'length';
            this.emit('captureLengthStart');
        }
    }

    onHoldOff(pad) {
        if (pad.xy === '00') {
            this.state = 'ready';
            this.emit('captureLengthStop');
        }
    }

}