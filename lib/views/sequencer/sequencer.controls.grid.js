
import {Utils} from '../../class/utils';
import {Controls} from '../../class/controls';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';

export class SequencerGridControls extends Controls {

    constructor () {
        super();
        this.num = 63;
        this.pads = Launchpad.pads.grid;
    }

    renderSeqLength(length, currPage) {
        let pagePad = Utils.getPagePadIndex(length);
        this.iterate((pad) => {
            if (currPage < pagePad.page) {
                pad.setColor('green');
            } else if (currPage > pagePad.page) {
                pad.setColor('off');
            } else {
                if (pad.i <= pagePad.pad) {
                    pad.setColor('green');
                } else {
                    pad.off();
                }
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

    startLengthCapture() {
        this.state = 'captureLength';
    }

    stopLengthCapture() {
        this.state = 'ready';
    }

    onClick(pad) {
        switch(this.state) {
            case 'ready':
                this.emit('assignStep', pad, pad.toggle('amber'));
                break;
            case 'captureLength':
                this.emit('setLength', pad);
                break;
        }
    }

    onDblClick(pad) {

    }

    onHold(pad) {

    }

    onHoldOff(pad) {

    }

}