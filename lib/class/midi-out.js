import midi from 'midi';
import {Hex} from './codes';
import {Utils} from './utils';

process.setMaxListeners(1000);

/**
 * Realtime MIDI output.
 */
export class MidiOut {

    /**
     *
     * @param defaultDuration
     */
    constructor({ defaultDuration=500 }={}) {
        this.output = new midi.output();
        this.isOpen = false;
        this.defaultDuration = defaultDuration;
        process.on('exit', () => this.close());
        process.on('beforeExit', () => this.panic().then(() => this.close()));
        process.on('SIGINT', () => this.panic().then(() => process.exit(130)));
    }

    /**
     * List available MIDI input ports
     */
    ports() {
        const count = this.output.getPortCount();
        const names = [];
        for (let i=0; i < count; i++) {
            names.push(this.output.getPortName(i));
        }
        return names;
    }

    /**
     * Open a MIDI input port
     * @param selector TODO
     * @returns {boolean} true if the port was opened
     */
    open(selector = 0) {
        if (!this.isOpen) {
            if (typeof selector === 'number') {
                return this.openByPortIndex(selector);
            }
            else if (selector.constructor === RegExp) {
                const portIndex = this.ports().findIndex(portName => portName.match(selector));
                if (portIndex >= 0) {
                    return this.openByPortIndex(portIndex);
                }
            }
            else {
                const portIndex = this.ports().findIndex(portName => portName == selector);
                if (portIndex >= 0) {
                    return this.openByPortIndex(portIndex);
                }
            }
        }
        return false;
    }

    openByPortIndex(portIndex) {
        if (!this.isOpen) {
            const portName = this.ports()[portIndex];
            if (portName) {
                console.log(`Opening MIDI output port[${portIndex}]: ${portName}`);
                this.output.openPort(portIndex);
                this.isOpen = true;
                this.portIndex = portIndex;
                this.portName = portName;
                return true;
            }
        }
        return false;
    }

    /**
     * Close the MIDI input port
     * @returns {boolean} true if the port was closed
     */
    close() {
        if (this.isOpen) {
            console.log(`Closing MIDI output port[${this.portIndex}]: ${this.portName}`);
            this.allNotesOff();
            this.output.closePort();
            this.isOpen = false;
            this.portIndex = null;
            this.portName = null;
        }
        return !this.isOpen;
    }

    /**
     * Send a raw byte list
     * @param bytes
     */
    send(...bytes) {
        if (!this.isOpen) return false;
        this.output.sendMessage(bytes);
        return true;
    }

    /**
     * Send a note on message
     * @param pitch
     * @param velocity
     * @param channel
     */
    noteOn(pitch, velocity=70, channel=1) {
        this.send(Hex.NOTE_ON | (channel-1), Number(pitch), velocity);
    }

    /**
     * Send a note off message
     * @param pitch
     * @param velocity
     * @param channel
     */
    noteOff(pitch, velocity=70, channel=1) {
        this.send(Hex.NOTE_OFF | (channel-1), Number(pitch), velocity);
    }

    /**
     * Send a note on, followed by a note off after the given duration in milliseconds
     *
     * NOTE: This is a convenience method. The timing is not always predictable.
     *       It's recommend you explicitly schedule noteOn() and noteOff() calls when using the {@link Scheduler}.
     * @param pitch
     * @param velocity
     * @param duration
     * @param channel
     */
    note(pitch, velocity=70, duration=this.defaultDuration, channel=1) {
        const pitchValue = Number(pitch); // coerce to a Number if needed (using Pitch.valueOf())
        this.noteOn(pitchValue, velocity, channel);
        setTimeout(() => this.noteOff(pitchValue, velocity, channel), duration)
    }

    /**
     * Turn off all notes for the given channel.
     *
     */
    allNotesOff() {
        if (!this.isOpen) return;
        for (let channel=1; channel <= 16; channel++) {
            for (let pitch = 0; pitch < 128; pitch++) {
                this.noteOff(pitch, 0, channel);
            }
        }
    }

    /**
     * Turn off all notes that could possibly be playing. Fixes "stuck" notes.
     *
     * Called automatically when Node.js exits.
     *
     * Note: Due to MIDI rate-limiting, this operation happens asynchronously over a few milliseconds.
     * @returns {Promise}
     * @see [allNotesOff(channel)]{@link MidiOut#allNotesOff}
     */
    panic() {
        if (!this.isOpen) return Promise.resolve();
        // Calls all notes off channel-by-channel sequentially, with a delay in between
        // to avoid dropping note-off events due to MIDI rate-limiting.
        return Utils.sequentialAsync(
            new Array(16).fill(0).map((_,idx) =>
                () => {
                    const channel = idx + 1;
                    this.allNotesOff(channel);
                    return Utils.sleep(10);
                }
            )
        );
    }
}