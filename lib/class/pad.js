
import {Launchpad} from './launchpad';
import {EventHandler} from './eventHandler';


export class Pad {

    constructor (x, y, parent) {

        this.x = x;
        this.y = y;
        this.key = [x, y];
        this.parent = parent;

        this.isControl = (x === 8 || y === 8);
        this.isControlTop = (y === 8);
        this.isControlRight = (x === 8);

        this.settings = {
            color: 'off',
            brightness: 'low',
            showing: false,
            flashing: false
        };

        let dblTimer = 0;
        let holdTimer = 0;
        let flashTimer = 0;
        let holding = false;

        let clickHandler = new EventHandler();
        this.onClick = clickHandler.register;
        this.click = clickHandler.trigger;

        let dblClickHandler = new EventHandler();
        this.onDblClick = dblClickHandler.register;
        this.dblClick = dblClickHandler.trigger;

        let holdHandler = new EventHandler();
        this.onHold = holdHandler.register;
        this.hold = holdHandler.trigger;

        let holdReleaseHandler = new EventHandler();
        this.onHoldRelease = holdReleaseHandler.register;
        this.holdRelease = holdReleaseHandler.trigger;

        Launchpad.on('key', (k) => {

            if (!this.parent.active) { return; }
            if (k.x !== x || k.y !== y) { return; }
            let now = new Date().getTime();

            if (k.pressed) {

                holdTimer = setTimeout(() => {
                    holding = true;
                    this.hold(this);
                }, 500);

                if (!dblTimer) {
                    dblTimer = now;
                    setTimeout(() => {
                        dblTimer = 0;
                    }, 200);
                } else {
                    if ((now - dblTimer) < 200) {
                        this.dblClick(this);
                    }
                    dblTimer = 0;
                }
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

    copySettingsFrom (pad) {

        Object.keys(this.settings).forEach((i) => {
            this.settings[i] = pad.settings[i];
        });

        if (this.settings.showing) {
            this.show();
        } else {
            this.hide();
        }

        if (this.settings.flashing) {
            this.flash(true);
        } else {
            this.flash(false);
        }
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

    show() {
        this.settings.showing = true;
        Launchpad.col(this.getColor(), this.key);
        return this;
    }

    off () {
        this.settings.color = 'off';
        return this.hide();
    }

    hide() {
        this.settings.showing = false;
        Launchpad.col(Launchpad.off, this.key);
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

    flash (bool, time, speed) {
        if (bool) {
            this.flashTimer = setInterval(() => {
                this.settings.flashing = true;
                if (this.settings.showing) {
                    this.hide();
                } else {
                    this.show();
                }
            }, speed);

            if (time) {
                setTimeout(() => {
                    this.flash(false);
                }, time);
            }

        } else {
            clearInterval(this.flashTimer);
            this.settings.flashing = false;
        }
        return this;
    }

}