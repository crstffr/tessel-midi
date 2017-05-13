
import {View} from '../../class/view';
import {Utils} from '../../class/utils';
import {Cursor} from '../../class/cursor';
import {Sequence} from '../../class/sequence';
import {Sequencer} from '../../class/sequencer';
import {Instrument} from '../../class/instrument';

import {SequencerRightControls} from './sequencer.controls.right';
import {SequencerGridControls} from './sequencer.controls.grid';
import {SequencerTopControls} from './sequencer.controls.top';

export class SequencerView extends View {

    constructor () {

        super();

        this.inst = 0;
        this.page = 0;

        this.instruments = Array(6).fill().map(() => new Instrument());

        /*
        this.sequences = Array(6).fill().map(() => new Sequence());
        this.sequence = this.sequences[0];
        this.sequence.on('step', this.renderPlayCursor.bind(this));
        */

        this.controls.top = new SequencerTopControls();
        this.controls.grid = new SequencerGridControls();
        this.controls.right = new SequencerRightControls();

        this.controls.top.on('copyPage', this.copyPage.bind(this));
        this.controls.top.on('clearPage', this.clearPage.bind(this));
        this.controls.top.on('switchPage', this.switchPage.bind(this));

        this.controls.right.on('play', this.play.bind(this));
        this.controls.right.on('stop', this.stop.bind(this));
        this.controls.right.on('pause', this.pause.bind(this));
        this.controls.right.on('switchInst', this.switchInst.bind(this));
        this.controls.right.on('startLengthCapture', this.startLengthCapture.bind(this));
        this.controls.right.on('stopLengthCapture', this.stopLengthCapture.bind(this));

        this.controls.grid.on('setLength', this.setLength.bind(this));
        this.controls.grid.on('assignStep', this.toggleStep.bind(this));

        this.switchPage(0);
        this.switchInst(0);
        this.renderSequence();

    }

    play() {
        Sequencer.play();
    }

    pause() {
        Sequencer.pause();
        /*
        let index = Utils.getPagePadIndex(this.sequence.step);
        this.cursor.pause(index.pad);
        */
    }

    stop() {
        Sequencer.stop();
        /*
        this.cursor.stop();
        */
    }

    renderPlayCursor(page, pad, i, step) {
        if (page !== this.page) { this.switchPage(page); }
        this.cursor.move(pad);
    }

    getSeq() {
        return this.instruments[this.inst].sequence;
    }

    getStep(i, page) {
        page = (typeof page === 'number') ? page : this.page;
        return (page * 63) + i + page;
    }

    renderLength() {
        this.controls.grid.renderSeqLength(this.getSeq(), true);
    }

    renderSequence() {
        this.controls.grid.renderSeqSteps(this.getSeq(), this.page);
    }

    toggleStep(pad, bool) {
        let method = ((bool) ? 'assign' : 'remove');
        let index = Utils.getStepIndex(pad.i, this.page);
        this.getSeq()[method](index);
    }

    setLength(pad) {
        let index = Utils.getStepIndex(pad.i, this.page);
        this.getSeq().setLength(index);
        this.renderLength();
    }

    startLengthCapture() {
        this.controls.grid.startLengthCapture();
        this.renderLength();
    }

    stopLengthCapture() {
        this.controls.grid.stopLengthCapture();
        this.renderSequence();
    }

    switchInst(i) {
        this.inst = i;
        this.controls.right.selectInstBtn(i);
        this.instruments.forEach((inst) => inst.deactivate());
        this.instruments[i].activate();
        console.log('select inst', i);
        this.renderSequence();
    }

    switchPage(i) {
        this.page = i;
        this.controls.top.selectPageBtn(i);
        this.renderSequence();
    }

    clearPage(page) {
        let start = Utils.getStepIndex(0, page);
        let end = Utils.getStepIndex(63, page);
        for(let i = start; i <= end; i++) {
            this.getSeq().remove(i);
        }
        this.renderSequence();
    }

    copyPage(fromPage, toPage) {
        let start = Utils.getStepIndex(0, toPage);
        let end = Utils.getStepIndex(63, toPage);
        let ii = Utils.getStepIndex(0, fromPage);
        for(let i = start; i <= end; i++) {
            let step = this.getSeq().steps[ii];
            this.getSeq().steps[i] = (step) ? Object.assign({}, step) : null;
            ii++;
        }
    }

}