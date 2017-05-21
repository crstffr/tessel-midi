
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

        this.controls.play.on('playStep', this.playStep.bind(this));
        this.controls.play.on('setModePlay', this.setModePlay.bind(this));
        this.controls.play.on('setModeRecord', this.setModeRecord.bind(this));
    }

    onEscape() {

        Router.switchView('seq');
    }

    onActivate(inst, step) {
        Midi.talk();
        this.inst = inst;
        this.step = step;
        this.setOctave(1);
        this.setLength(step.length);
        this.controls.grid.renderNotes(this.step.notes);
    }

    onDeactivate() {
        this.state = 'ready';
    }

    playStep() {
        this.inst.playStep(this.step);
    }

    setModePlay() {
        this.state = 'ready';
    }

    setModeRecord() {
        this.state = 'record';
    }

    pressPad(pad, note) {
        switch(this.state) {
            case 'ready':
                pad.setColor('amber');
                this.inst.playNote(note, this.step);
                break;
            case 'record':
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