import {Launchpad as LP} from '../class/launchpad';
import {Controls} from '../class/controls';
import {View} from '../class/view';
import {Page} from '../class/page';
import {Pad} from '../class/pad';

export class SequencerView extends View {

    constructor () {

        super('sequencer');
        this.active = false;

        this.controls.top = new SequencerTopControls(this);
        this.controls.right = new SequencerRightControls(this);

        this.pages = Array(8).fill().map((v,i) => {
            return new SequencerPage('sequencer-' + i);
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

}

class SequencerPage extends Page {

    constructor (name) {
        super(name);
    }

    handleClick(pad) {
        pad.toggle('amber', 'low');
    }
}

class SequencerTopControls extends Controls {

    constructor (view) {
        super('top');
        this.view = view;
    }

    handleClick(pad) {
        this.clearAll();
        pad.setColor('green', 'low');
        this.view.deactivatePages();
        this.view.pages[pad.x].activate();
    }

}

class SequencerRightControls extends Controls {

    constructor (view) {
        super('right');
        this.view = view;
    }

    handleClick(pad) {
        this.clearAll();
        pad.setColor('red', 'low');
    }

}