
import {Sequencer} from './sequencer';
import {RightControls} from './controlsRight';

export class PlayControls extends RightControls {

    constructor () {
        super();

        this.selectPads((pad) => {
            return pad.value >= 6;
        });

        this.btns.rec = this.btns.G;
        this.btns.play = this.btns.H;

    }

    onActivate() {

        this.btns.rec.define({
            noteMode: {
                color: 'green'
            },
            stepMode: {
                color: 'amber'
            },
            recordMode: {
                color: 'red'
            }
        });

        this.btns.play.define({
            stopped: { color: 'green'},
            paused: { color: 'amber'},
            playing: { color: 'green', flash: true}
        }).load('stopped');

    }

    setNoteMode() {
        this.emit('noteMode');
        this.btns.rec.load('noteMode');
    }

    setStepMode() {
        this.emit('stepMode');
        this.btns.rec.load('stepMode');
    }

    setRecordMode() {
        this.emit('recordMode');
        this.btns.rec.load('recordMode');
    }

    onClick(pad) {
        switch(pad) {
            case this.btns.play:
                this.playPause();
                break;
            case this.btns.rec:
                this.noteStepRecord();
                break;
        }
    }

    onHold(pad) {
        switch(pad) {
            case this.btns.rec:
                this.emit('recHold');
                break;
            case this.btns.play:
                this.emit('playHold');
        }
    }

    onHoldOff(pad) {
        switch(pad) {
            case this.btns.rec:
                this.emit('recHoldOff');
                break;
            case this.btns.play:
                this.emit('playHoldOff');
        }
    }

    playPause() {
        let btn = this.btns.play;
        switch (Sequencer.state) {
            case 'playing':
                this.emit('stop');
                btn.load('stopped');
                break;
            default:
                this.emit('play');
                btn.load('playing');
                this.setStepMode();
                break;
        }
    }

    noteStepRecord() {
        let btn = this.btns.rec;
        switch (btn.state) {
            case 'noteMode':
                this.setRecordMode();
                break;
            case 'recordMode':
                this.setStepMode();
                break;
            case 'stepMode':
                this.setNoteMode();
                break;
        }
        this.btns.play.load('stopped');
    }

}