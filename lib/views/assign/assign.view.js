
import {Note} from '../../class/note';
import {View} from '../../class/view';
import {Midi} from '../../class/midi';
import {Utils} from '../../class/utils';
import {Router} from '../../class/router';
import {Stream} from '../../class/eventStream';
import {Sequencer} from '../../class/sequencer';

import {AssignOctaveControls} from './assign.controls.octave';
import {AssignRightControls} from './assign.controls.right';
import {AssignGridControls} from './assign.controls.grid';
import {AssignTopControls} from './assign.controls.top';

export class AssignView extends View {

    constructor () {
        super();
        this.controls.top = new AssignTopControls();
        this.controls.grid = new AssignGridControls();
        this.controls.right = new AssignRightControls();
        this.controls.octave = new AssignOctaveControls();
        this.controls.top.on('escape', this.onEscape.bind(this));
        this.controls.top.on('setLength', this.setLength.bind(this));
        this.controls.right.on('play', this.play.bind(this));
        this.controls.right.on('setVelocity', this.setVelocity.bind(this));
        this.controls.grid.on('playNote', this.playNote.bind(this));
        this.controls.grid.on('assignNote', this.assignNote.bind(this));
        this.controls.octave.on('setOctave', this.setOctave.bind(this));
    }

    onEscape() {
        Router.switchView('seq');
    }

    onActivate(inst, step) {
        Midi.talk();
        this.inst = inst;
        this.step = step;
        this.setOctave(0);
        this.setLength(step.length);
        this.setVelocity(step.velocity);
        this.controls.grid.renderNotes(this.step.notes);
    }

    onDeactivate() {
        Midi.off();
    }

    playNote(note) {
        this.inst.playNote(note, this.step);
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
        this.controls.top.renderLength(val);
    }

    setVelocity(val) {
        this.step.velocity = val;
        this.controls.right.renderVelocity(val);
    }

    setOctave(val) {
        this.controls.grid.setOctave(val);
        this.controls.octave.renderSelection(val);
        this.controls.grid.renderNotes(this.step.notes);
    }

}