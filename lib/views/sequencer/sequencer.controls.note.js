
import {Utils} from '../../class/utils';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';
import {GridControls} from '../../class/controlsGrid';

export class SequencerNoteControls extends GridControls {

    constructor () {

        super();

        this.octave = 1;
        this.octaveSize = 32; // not real "octave" obv

        this.iterate((pad) => {
            pad.define({
                play: {
                    color: 'green'
                },
                record: {
                    color: 'red'
                }
            });
        });

    }

    onDeactivate() {
        this.clearAll();
    }

    setOctave(val) {
        this.octave = val;
    }

    onPress(pad) {
        this.emit('noteOn', pad, this.getOffset(pad.value));
    }

    onRelease(pad) {
        this.emit('noteOff', pad, this.getOffset(pad.value));
        pad.load('off');
    }

    getOffset(i) {
        return 127 - (Number(i) + (this.octave * this.octaveSize));
    }

}