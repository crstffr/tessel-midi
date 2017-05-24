
import {View} from '../../class/view';
import {Midi} from '../../class/midi';
import {Utils} from '../../class/utils';
import {Cursor} from '../../class/cursor';
import {Router} from '../../class/router';
import {Stream} from '../../class/eventStream';
import {Sequencer} from '../../class/sequencer';
import {Instrument} from '../../class/instrument';

import {SequencerPlayControls} from './sequencer.controls.play';
import {SequencerInstControls} from './sequencer.controls.inst';
import {SequencerGridControls} from './sequencer.controls.grid';
import {SequencerPageControls} from './sequencer.controls.page';

export class SequencerView extends View {

    constructor () {

        super();

        this.inst = 0;
        this.record = {};
        this.instruments = this.createNewInstruments();

        this.controls.page = new SequencerPageControls();
        this.controls.grid = new SequencerGridControls();
        this.controls.play = new SequencerPlayControls();
        this.controls.inst = new SequencerInstControls();

        this.controls.page.on('copyPage', this.onCopyPageBtn.bind(this));
        this.controls.page.on('clearPage', this.onClearPageBtn.bind(this));
        this.controls.page.on('switchPage', this.onSwitchPageBtn.bind(this));

        this.controls.play.on('play', this.onPlayBtn.bind(this));
        this.controls.play.on('stop', this.onStopBtn.bind(this));
        this.controls.play.on('pause', this.onPauseBtn.bind(this));
        this.controls.play.on('record', this.onRecordBtn.bind(this));
        this.controls.play.on('stopCapture', this.stopCapture.bind(this));
        this.controls.play.on('startLengthCapture', this.startLengthCapture.bind(this));
        this.controls.play.on('startRecordCapture', this.startRecordCapture.bind(this));

        this.controls.inst.on('switchInst', this.onSwitchInstBtn.bind(this));

        this.controls.grid.on('setStart', this.setStart.bind(this));
        this.controls.grid.on('setLength', this.setLength.bind(this));
        this.controls.grid.on('setRecord', this.setRecord.bind(this));
        this.controls.grid.on('clickStep', this.onClickStepBtn.bind(this));

        Stream.on('get.sequencer.page', this.getPage.bind(this));
        Stream.on('get.sequencer.sequence', this.getSeq.bind(this));
        Stream.on('get.sequencer.instrument', this.getInst.bind(this));

    }

    onActivate() {
        this.switchInst(this.inst);
    }

    createNewInstruments() {
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
            case 'captureRecord':
                return this.controls.page.selected;
                break;
        }
    }

    /**
     * BUTTON HANDLERS
     */

    onPlayBtn() {
        if (Sequencer.state === 'stopped') {
            let pp = Utils.getPagePadIndex(this.getSeq().start);
                if (pp.page !== this.getPage()) {
                    this.switchPage(pp.page);
            }
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

    onRecordBtn() {
        Sequencer.record();
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

    onClickStepBtn(pad) {
        let s = this.getStep(pad);
        s.active = !s.active;
        pad.update('seqStep', {on: s.active}).render();
    }

    /**
     * RENDER GRID
     */

    renderLength() {
        this.controls.grid.renderSeqLength(this.getSeq(), this.getPage());
    }

    renderRecord() {
        let e = Number(this.record.end);
        let s = Number(this.record.start);
        this.controls.grid.renderRecLength(s, e, this.getPage());
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
        if (!this.getStep(pad)) { return; }
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

    setRecord(pad) {
        let page = this.getPage();
        let index = Utils.getStepIndex(pad.i, page);
        if (this.record.start >= 0) {
            this.record.end = index;
        } else {
            this.record.start = index;
            this.record.end = index;
        }
        this.renderRecord();
    }

    startLengthCapture() {
        this.state = 'captureLength';
        this.controls.grid.startLengthCapture();
        let pagePad = Utils.getPagePadIndex(this.getSeq().length);
        this.switchPage(pagePad.page);
        this.renderLength();
    }

    startRecordCapture() {
        this.state = 'captureRecord';
        this.controls.grid.startRecordCapture();
        this.renderRecord();
    }

    stopCapture() {
        console.log('STOP CAPTURE');
        this.record = {};
        this.state = 'ready';
        this.controls.grid.stopCapture();
        this.switchPage(this.getPage());
    }

    /**
     * INSTRUMENT AND PAGE SELECTION
     */

    switchInst(inst) {
        let page = this.getPage();
        this.inst = inst;
        this.controls.inst.selectInstBtn(inst);
        this.instruments.forEach((i) => i.deactivate());
        this.instruments[inst].activate();
        this.switchPage(page);
    }

    switchPage(page) {
        switch (this.state) {
            case 'ready':
                this.getInst().switchPage(page);
                this.controls.page.selectPageBtn(page);
                this.renderSequence();
                Cursor.wait = 1;
                break;
            case 'captureLength':
                this.controls.page.selectPageBtn(page);
                this.renderLength();
                break;
            case 'captureRecord':
                this.controls.page.selectPageBtn(page);
                this.renderRecord();
                break;
        }
    }

}