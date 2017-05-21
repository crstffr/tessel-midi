
import {Utils} from '../../class/utils';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';
import {GridControls} from '../../class/controlsGrid';

export class SequencerGridControls extends GridControls {

    constructor () {
        super();
        this.num = Object.keys(this.pads).length - 1;
    }

    renderSeqLength(seq, currPage) {
        let ppStart = Utils.getPagePadIndex(seq.start);
        let ppEnd = Utils.getPagePadIndex(seq.length);
        this.iterate((pad) => {
            let on = false;
            if (currPage > ppStart.page && currPage < ppEnd.page) {
                on = true;
            } else if (currPage < ppStart.page || currPage > ppEnd.page) {
                on = false;
            } else {
                on = true;
                if (currPage === ppStart.page) {
                    if (pad.value < ppStart.pad) {
                        on = false;
                    }
                }
                if (currPage === ppEnd.page) {
                    if (pad.value > ppEnd.pad) {
                        on = false;
                    }
                }
            }
            if (on) {
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

    onHold(pad) {
        switch(this.state) {
            case 'ready':
                if (pad.settings.on) {
                    this.emit('assignNote', pad);
                }
                break;
            case 'captureLength':
                this.emit('setStart', pad);
                break;
        }
    }

}