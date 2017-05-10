
import {Launchpad} from './launchpad';
import {EventHandler} from './eventHandler';


export class Pad {

    constructor (x, y, parent) {
        this.x = x;
        this.y = y;
        this.key = [x, y];
        this.parent = parent;

        this.settings = {
            color: 'off',
            brightness: 'low',
            showing: false
        };

        let holdTimer = 0;
        let flashTimer = 0;
        let holding = false;
        let flashing = false;

        let clickHandler = new EventHandler();
        this.onClick = clickHandler.register;
        this.click = clickHandler.trigger;

        let holdHandler = new EventHandler();
        this.onHold = holdHandler.register;
        this.hold = holdHandler.trigger;

        let holdReleaseHandler = new EventHandler();
        this.onHoldRelease = holdReleaseHandler.register;
        this.holdRelease = holdReleaseHandler.trigger;

        Launchpad.on('key', (k) => {

            if (!this.parent.active) { return; }
            if (k.x !== x || k.y !== y) { return; }

            if (k.pressed) {
                holdTimer = setTimeout(() => {
                    holding = true;
                    this.hold(this);
                }, 500);
            }

            if (!k.pressed) {
                if (!holding) {
                    this.click(this);
                } else {
                    holding = false;
                    this.holdRelease(this);
                }
                clearTimeout(holdTimer);
            }
        });

    }

    setColor (color, brightness) {
        this.settings.color = color || 'amber';
        this.settings.brightness = brightness || 'low';
        return this.show();
    }

    getColor () {
        let s = this.settings;
        return (s.color !== 'off')
            ? Launchpad[s.color][s.brightness]
            : Launchpad.off;
    }

    off () {
        this.settings.color = 'off';
        return this.hide();
    }

    flash (bool, time) {
        if (bool) {
            this.flashTimer = setInterval(() => {
                this.flashing = true;
                if (this.settings.showing) {
                    this.hide();
                } else {
                    this.show();
                }
            }, 100);

            if (time) {
                setTimeout(() => {
                    this.flash(false);
                }, time);
            }

        } else {
            clearInterval(this.flashTimer);
            this.flashing = false;
        }
        return this;
    }

    hide() {
        this.settings.showing = false;
        Launchpad.col(Launchpad.off, this.key);
        return this;
    }

    show() {
        this.settings.showing = true;
        Launchpad.col(this.getColor(), this.key);
        return this;
    }

    toggle(color, brightness) {
        if (this.settings.color === color) {
            this.off();
        } else {
            this.setColor(color, brightness)
        }
        return this;
    }

}