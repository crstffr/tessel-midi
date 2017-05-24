
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

        this.btns.rec.define({ready: {color: 'red'}}).load('ready');

        this.btns.play.define({
            ready: { color: 'green'},
            paused: { color: 'amber'},
            playing: { color: 'green', flash: true}
        }).load('ready');

    }

    onClick(pad) {
        switch(pad) {
            case this.btns.play:
                this.playPause();
                break;
            case this.btns.rec:
                this.stopRec();
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
                this.emit('pause');
                btn.load('paused');
                break;
            default:
                this.emit('play');
                btn.load('playing');
                break;
        }
    }

    stopRec() {
        switch (Sequencer.state) {
            case 'stopped':
                this.emit('record');
                break;
            default:
                this.emit('stop');
                break;
        }
        this.btns.play.load('ready');
    }

}