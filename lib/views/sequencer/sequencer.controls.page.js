
import {TopControls} from '../../class/controlsTop';
import {Launchpad} from '../../class/launchpad';

export class SequencerPageControls extends TopControls {

    constructor () {
        super();
        this.selected = 0;

        this.iterate((pad) => {
            pad.define({
                pageSelected: {
                    color: 'green'
                },
                copying: {
                    color: 'green',
                    flash: true
                },
                copied: {
                    color: 'amber',
                    flash: {
                        time: 600
                    }
                }
            });
        });
    }

    selectPageBtn(i) {
        this.clearAll();
        this.selected = i;
        this.btns[i + 1].load('pageSelected');
    }

    onClick(pad) {
        switch (this.state) {
            case 'ready':
                this.emit('switchPage', pad.value);
                break;

            case 'copy':
                this.emit('copyPage', this.data.pad.value, pad.value);
                pad.load('copied');
                break;
        }
    }


    onHold(pad) {
        this.data.pad = pad;
        this.state = 'copy';
        pad.load('copying');
    }

    onHoldOff(pad) {
        this.state = 'ready';
        pad.stopFlashing();
        pad.loadPrev();
    }

}