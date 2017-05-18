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
        this.device = Launchpad;
    }

    activate () {
        this.bind();
        this.active = true;
        this.onActivate();
    }

    deactivate () {
        this.unbind();
        this.clearAll();
        this.active = false;
        this.onDeactivate();
    }

    iterate(cb) {
        Object.keys(this.pads).forEach((key) => {
            cb(this.pads[key]);
        });
    }

    clearAll () {
        this.iterate((pad) => {
            pad.off().off();
        });
    }

    onHold() {}
    onPress() {}
    onClick() {}
    onRelease() {}
    onHoldOff() {}
    onDblClick() {}
    onActivate() {}
    onDeactivate() {}

    bind() {
        Object.keys(this.pads).forEach((key) => {
            let pad = this.pads[key];
            pad.on('hold', this.onHold.bind(this));
            pad.on('click', this.onClick.bind(this));
            pad.on('pushOn', this.onPress.bind(this));
            pad.on('pushOff', this.onRelease.bind(this));
            pad.on('holdOff', this.onHoldOff.bind(this));
            pad.on('dblClick', this.onDblClick.bind(this));
        });
    }

    unbind() {
        Object.keys(this.pads).forEach((key) => {
            let pad = this.pads[key];
            pad.removeAllListeners('hold');
            pad.removeAllListeners('click');
            pad.removeAllListeners('pushOn');
            pad.removeAllListeners('pushOff');
            pad.removeAllListeners('holdOff');
            pad.removeAllListeners('dblClick');
        });
    }

}