import events from 'events';
import {Utils} from './utils';
import {MidiIn} from './midi-in';
import {MidiOut} from './midi-out';
import {Sequencer} from './sequencer';

class MidiClass extends events.EventEmitter {

    constructor () {
        super();
        this.port = 1;
        this.input = null;
        this.output = null;
    }

    off() {
        if (this.input) {
            this.input.close();
            this.input = null;
        }
        if (this.output) {
            this.output.close();
            this.output = null;
        }
    }

    listen() {
        if (this.input) { return; }

        if (this.output) {
            this.output.close();
            this.output = null;
        }

        this.input = new MidiIn();
        this.input.open(this.port);
        this.onMessage((msg) => {
            this.emit('msg', Utils.parseMidiMessage(msg));
        });
    }

    talk() {
        if (this.output) { return; }

        if (this.input) {
            this.input.close();
            this.input = null;
        }

        this.output = new MidiOut();
        this.output.open(this.port);
    }

    play(pitch, velocity=127, duration=Sequencer.stepWait(), channel=1) {
        if (!this.output) { return; }
        this.output.note(pitch, velocity, duration, channel);
    }



}

export let Midi = new MidiClass();