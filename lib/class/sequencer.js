import events from 'events';

class SequencerClass extends events.EventEmitter {

    constructor() {
        super();
        this.timer = 0;
        this.beats = 4;
        this.tempo = 128;
        this.state = 'stopped';
        this.setMaxListeners(100);
    }

    stepWait(multiplier) {
        multiplier = multiplier || 7;
        return (((1000 / (this.tempo / 60)) / this.beats) / 7) * multiplier;
    }

    play() {
        this.emit('play');
        this.state = 'playing';
        this.emit('step');
        this.timer = setInterval(() => {
            if (this.state !== 'playing') { return; }
            this.emit('step');
        }, this.stepWait());
    }

    pause() {
        clearInterval(this.timer);
        this.state = 'paused';
        this.emit('pause');
    }

    stop() {
        clearInterval(this.timer);
        this.state = 'stopped';
        this.emit('stop');
    }

    record() {
        this.state = 'recording';
        this.emit('record');
    }

}

export let Sequencer = new SequencerClass();