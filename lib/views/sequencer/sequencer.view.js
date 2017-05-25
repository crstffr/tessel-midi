
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
import {SequencerNoteControls} from './sequencer.controls.note';
import {SequencerStepControls} from './sequencer.controls.step';

export class SequencerView extends View {

    constructor () {

        super();

        this.inst = 0;
        this.record = {};
        this.state = '';
        this.capture = '';
        this.instruments = this.createNewInstruments();

        this.controls.page = new SequencerPageControls();
        this.controls.grid = new SequencerGridControls();
        this.controls.play = new SequencerPlayControls();
        this.controls.inst = new SequencerInstControls();
        this.controls.note = new SequencerNoteControls();
        this.controls.step = new SequencerStepControls();

        this.controls.page.on('copyPage', this.onCopyPageBtn.bind(this));
        this.controls.page.on('clearPage', this.onClearPageBtn.bind(this));
        this.controls.page.on('switchPage', this.onSwitchPageBtn.bind(this));

        this.controls.play.on('play', this.onPlayBtn.bind(this));
        this.controls.play.on('stop', this.onStopBtn.bind(this));
        this.controls.play.on('noteMode', this.noteMode.bind(this));
        this.controls.play.on('stepMode', this.stepMode.bind(this));
        this.controls.play.on('recordMode', this.recordMode.bind(this));
        this.controls.play.on('stopCapture', this.stopCapture.bind(this));
        this.controls.play.on('startLengthCapture', this.startLengthCapture.bind(this));
        this.controls.play.on('startRecordCapture', this.startRecordCapture.bind(this));

        this.controls.inst.on('stopCapture', this.stopCapture.bind(this));
        this.controls.inst.on('switchInst', this.onSwitchInstBtn.bind(this));
        this.controls.inst.on('startChannelCapture', this.startChannelCapture.bind(this));

        this.controls.grid.on('setStart', this.setStart.bind(this));
        this.controls.grid.on('setLength', this.setLength.bind(this));
        this.controls.grid.on('setRecord', this.setRecord.bind(this));
        this.controls.grid.on('setChannel', this.setChannel.bind(this));

        this.controls.note.on('noteOn', this.noteOn.bind(this));
        this.controls.step.on('stepOn', this.stepOn.bind(this));

        Stream.on('get.sequencer.page', this.getPage.bind(this));
        Stream.on('get.sequencer.sequence', this.getSeq.bind(this));
        Stream.on('get.sequencer.instrument', this.getInst.bind(this));

    }

    onActivate() {
        this.switchInst(this.inst);
        this.controls.play.setNoteMode();
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
            case 'stepMode':
            case 'recordMode':
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
        Cursor.playState();
        Sequencer.play();
    }

    onStopBtn() {
        Sequencer.stop();
        switch (this.state) {
            case 'stepMode':
                Cursor.stepState().show();
                break;
        }
    }

    onSwitchInstBtn(i) {
        this.switchInst(i);
    }

    onSwitchPageBtn(i) {
        if (Sequencer.state === 'playing') { return; }
        if (this.state === 'recordMode') { return; }
        if (this.state === 'noteMode') { return; }
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
        this.controls.step.renderSeqSteps(this.getSeq(), this.getPage());
    }

    renderChannel() {
        this.controls.grid.renderChannel(this.getInst().channel);
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

    setChannel(pad) {
        this.getInst().channel = pad.value + 1;
        this.renderChannel();
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
        if (this.state !== 'stepMode') { return; }
        this.configMode();
        this.capture = 'length';
        this.controls.grid.startLengthCapture();
        let pagePad = Utils.getPagePadIndex(this.getSeq().length);
        this.switchPage(pagePad.page);
        this.renderLength();
    }

    startRecordCapture() {
        this.capture = 'record';
        this.controls.grid.startRecordCapture();
        this.renderRecord();
    }

    startChannelCapture(i) {
        this.configMode();
        this.switchInst(i);
        this.capture = 'channel';
        this.controls.grid.startChannelCapture();
        this.renderChannel()
    }

    stopCapture() {
        this.capture = '';
        this.controls.grid.stopCapture();
        this[this.state]();
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
            case 'stepMode':
                this.getInst().switchPage(page);
                this.controls.page.selectPageBtn(page);
                if (!this.capture) {
                    this.renderSequence();
                } else {
                    this.renderLength();
                }
                break;
            case 'recordMode':
                this.getInst().switchPage(page);
                this.controls.page.selectPageBtn(page);
                let pp = Utils.getPagePadIndex(this.getSeq().pos);
                Cursor.move(pp.pad);
                break;
            default:
                switch(this.capture) {
                    case 'length':
                        this.controls.page.selectPageBtn(page);
                        this.renderLength();
                        break;
                    case 'record':
                        this.controls.page.selectPageBtn(page);
                        this.renderRecord();
                        break;
                }
                break;
        }
    }

    /**
     * GRID CONTROL MODES
     */

    disableModes() {
        Sequencer.stop();
        this.controls.step.deactivate();
        this.controls.note.deactivate();
        this.controls.grid.deactivate();
    }

    configMode() {
        this.disableModes();
        this.controls.grid.activate();
    }
    
    noteMode() {
        this.disableModes();
        this.state = 'noteMode';
        this.controls.note.activate();
        Midi.talk();
    }

    noteOn(pad, note) {
        switch(this.state) {
            case 'noteMode':
                pad.load('play');
                break;
            case 'recordMode':
                pad.load('record');
                Sequencer.emit('step');
                break;
        }
        this.getInst().playNote(note, this.getSeq().steps[0]);
    }
    
    stepMode() {
        this.disableModes();
        this.state = 'stepMode';
        this.controls.page.activate();
        this.controls.step.activate();
        this.switchPage(this.getPage());
    }

    stepOn(pad) {
        let s = this.getStep(pad);
        s.active = !s.active;
        pad.update('step', {on: s.active}).load('step');
    }
    
    recordMode() {
        this.disableModes();
        this.state = 'recordMode';
        this.controls.page.activate();
        this.controls.note.activate();
        this.switchPage(this.getPage());
        Cursor.recordState().show();
        Sequencer.emit('step');
    }

}