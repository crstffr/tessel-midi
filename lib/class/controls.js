import events from 'events';
import {Launchpad} from './launchpad';
import {Pad} from './pad';

export class Controls extends events.EventEmitter {

    constructor() {
        super();
        this.pads = {};
        this.data = {};
        this.state = 'ready';
        this.active = false;
    }

    activate () {
        this.bind();
        this.active = true;
    }

    deactivate () {
        this.unbind();
        this.clearAll();
        this.active = false;
    }

    iterate(cb) {
        Object.values(this.pads).forEach(cb);
    }

    clearAll () {
        this.iterate((pad) => {
            pad.off();
        });
    }

    onHold() {}
    onClick() {}
    onHoldOff() {}
    onDblClick() {}

    bind() {
        Object.values(this.pads).forEach((pad) => {
            pad.on('hold', this.onHold.bind(this));
            pad.on('click', this.onClick.bind(this));
            pad.on('holdOff', this.onHoldOff.bind(this));
            pad.on('dblClick', this.onDblClick.bind(this));
        });
    }

    unbind() {
        Object.values(this.pads).forEach((pad) => {
            pad.removeListener('hold', this.onHold.bind(this));
            pad.removeListener('click', this.onClick.bind(this));
            pad.removeListener('holdOff', this.onHoldOff.bind(this));
            pad.removeListener('dblClick', this.onDblClick.bind(this));
        });
    }

}