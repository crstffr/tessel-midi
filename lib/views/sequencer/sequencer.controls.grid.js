
import {Utils} from '../../class/utils';
import {Controls} from '../../class/controls';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';

export class SequencerGridControls extends Controls {

    constructor () {
        super();
        this.num = 63;
        this.pads = Launchpad.pads.grid;

        Object.keys(Launchpad.pads.indexed).forEach((key) => {
            let pad = Launchpad.pads.indexed[key];
        });

    }

    renderSeqLength(seq, currPage) {
        let ppStart = Utils.getPagePadIndex(seq.start);
        let ppEnd = Utils.getPagePadIndex(seq.length);
        this.iterate((pad) => {
            if (currPage > ppStart.page && currPage < ppEnd.page) {
                pad.setColor('green');
            } else if (currPage < ppStart.page || currPage > ppEnd.page) {
                pad.setColor('off');
            } else {
                pad.setColor('green');
                if (currPage === ppStart.page) {
                    if (pad.i < ppStart.pad) {
                        pad.off();
                    }
                }
                if (currPage === ppEnd.page) {
                    if (pad.i > ppEnd.pad) {
                        pad.off();
                    }
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
        switch(this.state) {
            case 'captureLength':
                this.emit('setStart', pad);
                break;
        }
    }

    onHoldOff(pad) {

    }

}