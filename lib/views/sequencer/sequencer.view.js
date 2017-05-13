
import {View} from '../../class/view';
import {Sequence} from '../../class/sequence';
import {Sequencer} from '../../class/sequencer';

import {SequencerRightControls} from './sequencer.controls.right';
import {SequencerGridControls} from './sequencer.controls.grid';
import {SequencerTopControls} from './sequencer.controls.top';

export class SequencerView extends View {

    constructor (sequencer) {

        super();

        this.page = 0;
        this.sequence = new Sequence();

        this.controls.top = new SequencerTopControls();
        this.controls.grid = new SequencerGridControls();
        this.controls.right = new SequencerRightControls();

        this.controls.top.on('copyPage', this.copyPage.bind(this));
        this.controls.top.on('clearPage', this.clearPage.bind(this));
        this.controls.top.on('switchPage', this.switchPage.bind(this));

        this.controls.grid.on('captureLengthStart', this.captureLengthStart.bind(this));
        this.controls.grid.on('captureLengthStop', this.captureLengthStop.bind(this));
        this.controls.grid.on('setLength', this.setLength.bind(this));
        this.controls.grid.on('assignStep', this.assignStep.bind(this));

        this.switchPage(0);
        this.renderSequence();

    }

    getStep(i, page) {
        page = page || this.page;
        return (page * 63) + i;
    }

    renderLength() {
        this.controls.grid.renderSeqLength(this.sequence, true);
    }

    renderSequence() {
        this.controls.grid.renderSeqSteps(this.sequence, this.page);
    }

    assignStep(pad, bool) {
        let method = ((bool) ? 'assign' : 'remove');
        this.sequence[method](this.getStep(pad.i));
    }

    setLength(pad) {
        this.sequence.setLength(this.getStep(pad.i));
        this.renderLength();
    }

    captureLengthStart() {
        this.renderLength();
    }

    captureLengthStop() {
        this.renderSequence();
    }

    switchPage(i) {
        this.page = i;
        this.controls.top.selectPageBtn(i);
        this.renderSequence();
    }

    clearPage(page) {
        let start = this.getStep(0, page);
        let end = this.getStep(63, page);
        for(let i = start; i <= end; i++) {
            this.sequence.remove(i);
        }
        this.renderSequence();
    }

    copyPage(from, to) {
        console.log('copy from', from, to);
        /*
        this.pages[to].copyPadsFrom(this.pages[from]);
        */
    }

}