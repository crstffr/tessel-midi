import tonal from 'tonal';
import {Utils} from '../../class/utils';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';
import {GridControls} from '../../class/controlsGrid';

export class SequencerNoteControls extends GridControls {

    constructor () {

        super();

        this.key = 'G';
        this.scale = 'bebop';

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

        this.scaledNotes = {};

        tonal.scale.names().forEach((scale) => {
            let fullname = [this.key, scale].join(' ');
            let notes = tonal.scale.notes(fullname);
            if (notes.length >= 8) {
                this.scaledNotes[fullname] = Array(8).fill().map((v, y) => {
                    let base = this.key + String(7 - y);
                    return tonal.scale.get(scale, base).slice(0,8);
                });
            }
        });
    }

    onDeactivate() {
        this.clearAll();
    }

    getMidi(pad) {
        let objKey = [this.key, this.scale].join(' ');
        return tonal.note.midi(this.scaledNotes[objKey][pad.y][pad.x]);
    }

    onPress(pad) {
        this.emit('noteOn', pad, this.getMidi(pad));
    }

    onRelease(pad) {
        this.emit('noteOff', pad, this.getMidi(pad));
        pad.load('off');
    }


}