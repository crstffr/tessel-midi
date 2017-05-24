
import events from 'events';
import {Utils} from './utils';
import {Sequencer} from './sequencer';
import {Launchpad} from './launchpad';
import {CursorControls} from './controlsCursor';

class PlayCursor extends CursorControls {

    constructor () {
        super();

        this.wait = 0;
        this.timer = 0;
        this.showing = false;
        this.color = 'green';
        this.state = 'ready';
        this.pads = Launchpad.pads.indexed;
        Sequencer.on('record', this.record.bind(this));
        Sequencer.on('pause', this.pause.bind(this));
        Sequencer.on('stop', this.stop.bind(this));
        Sequencer.on('play', this.play.bind(this));

    }

    pad() {
        return this.pads[this.pos];
    }

    hide() {
        this.pad().loadPrev();
        this.showing = false;
    }

    show() {
        this.showing = true;
        this.pad().load('playCursor');
    }

    move(i) {
        if (this.wait !== 1) {
            this.pad().loadPrev();
        }
        this.pos = i;
        this.wait = 0;
        this.pad().load('playCursor');
    }

    play() {
        this.wait = (Sequencer.state === 'stopped') ? 1 : 0;
    }

    pause() {

    }

    stop() {
        this.pad().loadPrev();
    }

    record() {

    }

}

export let Cursor = new PlayCursor();