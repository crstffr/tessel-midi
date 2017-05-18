
import {View} from '../../class/view';
import {Midi} from '../../class/midi';
import {Utils} from '../../class/utils';
import {Router} from '../../class/router';
import {Stream} from '../../class/eventStream';
import {Sequencer} from '../../class/sequencer';
import {Instrument} from '../../class/instrument';

import {SequencerRightControls} from './sequencer.controls.right';
import {SequencerGridControls} from './sequencer.controls.grid';
import {SequencerTopControls} from './sequencer.controls.top';

export class SequencerView extends View {

    constructor () {

        super();

        this.inst = 0;
        this.instruments = this.getNewInstruments();

        this.controls.top = new SequencerTopControls();
        this.controls.grid = new SequencerGridControls();
        this.controls.right = new SequencerRightControls();

        this.controls.top.on('copyPage', this.onCopyPageBtn.bind(this));
        this.controls.top.on('clearPage', this.onClearPageBtn.bind(this));
        this.controls.top.on('switchPage', this.onSwitchPageBtn.bind(this));

        this.controls.right.on('play', this.onPlayBtn.bind(this));
        this.controls.right.on('stop', this.onStopBtn.bind(this));
        this.controls.right.on('pause', this.onPauseBtn.bind(this));

        this.controls.right.on('switchInst', this.onSwitchInstBtn.bind(this));
        this.controls.right.on('startLengthCapture', this.startLengthCapture.bind(this));
        this.controls.right.on('stopLengthCapture', this.stopLengthCapture.bind(this));

        this.controls.grid.on('setStart', this.setStart.bind(this));
        this.controls.grid.on('setLength', this.setLength.bind(this));
        this.controls.grid.on('assignStep', this.assignStep.bind(this));
        this.controls.grid.on('assignNote', this.assignNote.bind(this));

        Stream.on('get.sequencer.page', this.getPage.bind(this));
        Stream.on('get.sequencer.sequence', this.getSeq.bind(this));
        Stream.on('get.sequencer.instrument', this.getInst.bind(this));

    }

    onActivate() {
        this.switchInst(this.inst);
        this.renderSequence();
    }

    getNewInstruments() {
        return Array(6).fill().map((v,i) => {
            let inst = new Instrument(i + 1);
            inst.on('switchPage', this.switchPage.bind(this));
            return inst;
        });
    }

    getInst() {
        return this.instruments[this.inst];
    }

    getSeq() {
        return this.getInst().sequence;
    }

    getStep(pad) {
        let i = Utils.getStepIndex(pad.i, this.getPage());
        return this.getSeq().steps[i];
    }

    getPage() {
        switch (this.state) {
            case 'ready':
                return this.getInst().page;
                break;
            case 'captureLength':
                return this.controls.top.page;
                break;
        }
    }

    /**
     * BUTTON HANDLERS
     */

    onPlayBtn() {
        if (Sequencer.state === 'stopped') {
            let ppStart = Utils.getPagePadIndex(this.getSeq().start);
            this.switchPage(ppStart.page);
        }
        Midi.talk();
        Sequencer.play();
    }

    onPauseBtn() {
        Sequencer.pause();
    }

    onStopBtn() {
        Sequencer.stop();
        Midi.off();
    }

    onSwitchInstBtn(i) {
        this.switchInst(i);
    }

    onSwitchPageBtn(i) {
        if (Sequencer.state === 'playing') { return; }
        this.switchPage(i);
    }

    onClearPageBtn(page) {
        let start = Utils.getStepIndex(0, page);
        let end = Utils.getStepIndex(63, page);
        for(let i = start; i <= end; i++) {
            this.getSeq().remove(i);
        }
        this.renderSequence();
    }

    onCopyPageBtn(from, to) {
        this.getSeq().copyPage(from, to);
    }

    /**
     * RENDER GRID
     */

    renderLength() {
        this.controls.grid.renderSeqLength(this.getSeq(), this.getPage());
    }

    renderSequence() {
        this.controls.grid.renderSeqSteps(this.getSeq(), this.getPage());
    }

    assignStep(pad, bool) {
        let method = ((bool) ? 'assign' : 'remove');
        let step = Utils.getStepIndex(pad.i, this.getPage());
        this.getSeq()[method](step);
    }

    assignNote(pad) {
        Router.switchView('assign', this.getInst(), this.getStep(pad));
    }

    /**
     * SEQ LENGTH CAPTURE
     */

    setStart(pad) {
        let page = this.getPage();
        let index = Utils.getStepIndex(pad.i, page);
        this.getSeq().setStart(index);
        this.renderLength();
    }

    setLength(pad) {
        let page = this.getPage();
        let index = Utils.getStepIndex(pad.i, page);
        this.getSeq().setLength(index);
        this.renderLength();
    }

    startLengthCapture() {
        this.state = 'captureLength';
        this.controls.grid.startLengthCapture();
        let pagePad = Utils.getPagePadIndex(this.getSeq().length);
        this.switchPage(pagePad.page);
        this.renderLength();
    }

    stopLengthCapture() {
        this.state = 'ready';
        this.controls.grid.stopLengthCapture();
        this.switchPage(this.getPage());
    }

    /**
     * INSTRUMENT AND PAGE SELECTION
     */

    switchInst(inst) {
        let page = this.getPage();
        this.inst = inst;
        this.controls.right.selectInstBtn(inst);
        this.instruments.forEach((i) => i.deactivate());
        this.instruments[inst].activate();
        this.switchPage(page);
    }

    switchPage(page) {
        switch (this.state) {
            case 'ready':
                this.getInst().switchPage(page);
                this.controls.top.selectPageBtn(page);
                this.renderSequence();
                break;
            case 'captureLength':
                this.controls.top.selectPageBtn(page);
                this.renderLength();
                break;
        }
    }

}