import {View} from '../../class/view';

import {SequencerRightControls} from './sequencer.controls.right';
import {SequencerTopControls} from './sequencer.controls.top';
import {SequencerPage} from './sequencer.page';


export class SequencerView extends View {

    constructor () {

        super('sequencer');
        this.active = false;

        this.controls.top = new SequencerTopControls(this);
        this.controls.right = new SequencerRightControls(this);

        this.pages = Array(8).fill().map((v,i) => {
            return new SequencerPage(i);
        });
    }

    activate() {
        this.active = true;
        this.controls.top.activate();
        this.controls.right.activate();
        this.controls.top.pads[0].click();
    }

    deactivate() {
        this.active = false;
        this.deactivatePages();
        this.controls.top.deactivate();
        this.controls.right.deactivate();
    }

    deactivatePages () {
        this.pages.forEach((page) => {
            page.deactivate();
        });
    }

    switchToPage(i) {
        this.deactivatePages();
        this.pages[i].activate();
    }

    clearPage(i) {
        this.pages[i].clearPads();
    }

    copyPage(from, to) {
        this.pages[to].copyPadsFrom(this.pages[from]);
    }

}