
import {Utils} from '../../class/utils';
import {Sequencer} from '../../class/sequencer';
import {Launchpad} from '../../class/launchpad';
import {GridControls} from '../../class/controlsGrid';

export class SequencerStepControls extends GridControls {

    constructor () {
        super();

        this.iterate((pad) => {
            pad.define({
                step: {
                    on: false,
                    color: 'amber'
                },
                stepCopy: {
                    color: 'amber',
                    flash: true
                }
            });
        });
    }

    onDeactivate() {
        this.clearAll();
    }

    renderSeqSteps(seq, page) {
        this.iterate((pad) => {
            let s = 'step';
            let i = Utils.getStepIndex(pad.i, page);
            pad.update(s, {on: seq.steps[i].active}).load(s);
        });
    }

    onClick(pad) {
        this.emit('stepOn', pad);
    }

    onHold(pad) {
        this.emit('copyStepOn', pad);
        pad.load('stepCopy');
    }

    onHoldOff(pad) {
        this.emit('copyStepOff', pad);
        pad.load('step');
    }

}