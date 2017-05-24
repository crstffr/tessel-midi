
import {Step} from '../../class/step';
import {Note} from '../../class/note';
import {View} from '../../class/view';
import {Midi} from '../../class/midi';
import {Utils} from '../../class/utils';
import {Router} from '../../class/router';
import {Stream} from '../../class/eventStream';
import {Sequencer} from '../../class/sequencer';

import {AssignOctaveControls} from './assign.controls.octave';
import {AssignPlayControls} from './assign.controls.play';
import {AssignGridControls} from './assign.controls.grid';
import {AssignTopControls} from './assign.controls.top';

export class AssignView extends View {

    constructor () {
        super();
        this.controls.top = new AssignTopControls();
        this.controls.grid = new AssignGridControls();
        this.controls.play = new AssignPlayControls();
        this.controls.octave = new AssignOctaveControls();

        this.controls.top.on('escape', this.onEscape.bind(this));
        this.controls.top.on('setLength', this.setLength.bind(this));

        this.controls.grid.on('pressPad', this.pressPad.bind(this));
        this.controls.grid.on('releasePad', this.releasePad.bind(this));
        this.controls.grid.on('assignNote', this.assignNote.bind(this));
        this.controls.octave.on('setOctave', this.setOctave.bind(this));

        this.controls.play.on('play', this.onPlayBtn.bind(this));
        this.controls.play.on('stop', this.onStopBtn.bind(this));
        this.controls.play.on('pause', this.onPauseBtn.bind(this));
        this.controls.play.on('record', this.onRecordBtn.bind(this));
        this.controls.play.on('playStep', this.playStep.bind(this));
        this.controls.play.on('setModePlay', this.setModePlay.bind(this));
    }

    onEscape() {

        Router.switchView('seq');
    }

    onActivate(inst, step) {
        Midi.talk();
        this.inst = inst;
        this.step = step || new Step();
        this.setOctave(1);
        this.setLength(this.step.length);
        this.controls.grid.renderNotes(this.step.notes);
    }

    onDeactivate() {
        this.state = 'ready';
    }

    onPlayBtn() {
        Midi.talk();
        Sequencer.play();
    }

    onPauseBtn() {
        Sequencer.pause();
    }

    onStopBtn() {
        Sequencer.stop();
    }

    onRecordBtn() {
        Sequencer.record();
    }

    playStep() {
        this.inst.playStep(this.step);
    }

    setModePlay() {
        this.state = 'ready';
    }

    pressPad(pad, note) {
        switch(Sequencer.state) {
            case 'stopped':
                pad.setColor('amber');
                this.inst.playNote(note, this.step);
                break;
            case 'recording':
                pad.setColor('red');
                if (this.step.notes[note]) {
                    delete this.step.notes[note];
                } else {
                    this.step.notes[note] = new Note(note);
                    this.controls.grid.renderNotes(this.step.notes);
                }
                this.inst.playStep(this.step);
                break;
        }
    }

    releasePad(pad, note) {
        if (this.step.notes[note]) {
            pad.setColor('amber');
        } else {
            pad.off();
        }
    }

    assignNote(int, bool) {
        if (bool) {
            this.step.notes[int] = new Note(int);
            this.inst.playStep(this.step);
        } else {
            delete this.step.notes[int];
        }
    }

    play() {
        this.inst.playStep(this.step);
    }

    setLength(val) {
        this.step.length = val;
        this.controls.top.renderValue(val);
    }

    setOctave(val) {
        this.controls.grid.setOctave(val);
        this.controls.octave.renderSelection(val);
        this.controls.grid.renderNotes(this.step.notes);
    }

}