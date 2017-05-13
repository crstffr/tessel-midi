
import {Controls} from '../../class/controls';
import {Launchpad} from '../../class/launchpad';

export class SequencerGridControls extends Controls {

    constructor () {
        super();
        this.num = 63;
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
        let pad = 0;
        let start = (page * this.num) + page;
        for(let i = start; i <= start + this.num; i++) {
            if (seq.steps[i]) {
                Launchpad.pads.indexed[pad].setColor('amber');
            }
            pad++;
        }
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