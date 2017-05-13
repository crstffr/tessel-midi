import events from 'events';

class SequencerClass extends events.EventEmitter {

    constructor() {
        super();
        this.timer = 0;
        this.tempo = 120;
        this.state = 'stop';
    }

    stepWait() {
        return 1000 / (this.tempo / 60);
    }

    play() {
        this.state = 'play';
        this.timer = setTimeout(() => {
            if (this.state !== 'play') { return; }
            this.emit('step');
        }, this.stepWait());
    }

    pause() {
        this.state = 'pause';
    }

    stop() {
        clearTimeout(this.timer);
        this.state = 'stop';
        this.emit('stop');
    }

}

export let Sequencer = new SequencerClass();