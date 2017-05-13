import events from 'events';

class SequencerClass extends events.EventEmitter {

    constructor() {
        super();
        this.timer = 0;
        this.beats = 4;
        this.tempo = 128;
        this.state = 'stop';
    }

    stepWait() {
        return (1000 / (this.tempo / 60)) / this.beats;
    }

    play() {
        this.state = 'play';
        this.emit('step');
        this.timer = setInterval(() => {
            if (this.state !== 'play') { return; }
            this.emit('step');
        }, this.stepWait());
    }

    pause() {
        clearInterval(this.timer);
        this.state = 'pause';
    }

    stop() {
        clearInterval(this.timer);
        this.state = 'stop';
        this.emit('stop');
    }

}

export let Sequencer = new SequencerClass();