
import {Utils} from '../../class/utils';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';
import {GridControls} from '../../class/controlsGrid';

export class SequencerGridControls extends GridControls {

    constructor () {
        super();
        this.iterate((pad) => {
            pad.define({
                playLength: {
                    color: 'green'
                },
                instChannel: {
                    color: 'green'
                },
                recLength: {
                    color: 'red'
                }
            });
        });
    }

    renderSeqLength(seq, currPage) {
        this.renderLength(seq.start, seq.length, currPage, 'playLength');
    }

    renderRecLength(start, end, currPage) {
        this.renderLength(start, end, currPage, 'recLength');
    }

    renderChannel(channel) {
        this.renderLength(0, channel - 1, 0, 'instChannel');
    }

    startChannelCapture() {
        this.state = 'captureChannel';
    }

    startLengthCapture() {
        this.state = 'captureLength';
    }

    startRecordCapture() {
        this.state = 'captureRecord';
    }

    stopCapture() {
        this.state = 'ready';
    }

    onClick(pad) {
        switch(this.state) {
            case 'captureLength':
                this.emit('setLength', pad);
                break;
            case 'captureRecord':
                this.emit('setRecord', pad);
                break;
            case 'captureChannel':
                if (pad.i < 16) {
                    this.emit('setChannel', pad);
                }
                break;
        }
    }

    onHold(pad) {
        switch(this.state) {
            case 'captureLength':
                this.emit('setStart', pad);
                break;
        }
    }

}