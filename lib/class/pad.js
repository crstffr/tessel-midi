import events from 'events';

export class Pad extends events.EventEmitter {

    constructor (btn, api) {

        super();
        
        let x = btn.x;
        let y = btn.y;
        
        this.x = x;
        this.y = y;
        this.i = (8 * y) + x;
        this.api = api;
        this.btn = btn;
        this.key = [x, y];
        this.xy = String(x) + String(y);
        this.saved = {};

        this.settings = {
            on: false,
            color: 'off',
            brightness: 'low',
            flashing: false
        };

        let dblTimer = 0;
        let holdTimer = 0;
        let flashTimer = 0;
        let holding = false;
        
        this.on('press', () => {

            let now = new Date().getTime();

            holdTimer = setTimeout(() => {
                holding = true;
                this.emit('hold', this);
            }, 500);

            if (!dblTimer) {
                dblTimer = now;
                setTimeout(() => {
                    dblTimer = 0;
                }, 200);
            } else {
                if ((now - dblTimer) < 200) {
                    this.emit('dblClick', this);
                }
                dblTimer = 0;
            }
        });

        this.on('release', () => {
            if (!holding) {
                this.emit('click', this);
            } else {
                holding = false;
                this.emit('holdOff', this);
            }
            clearTimeout(holdTimer);
        });

    }

    copySettingsFrom (pad) {

        Object.keys(this.settings).forEach((i) => {
            this.settings[i] = pad.settings[i];
        });

        if (this.settings.on) {
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
            ? this.api[s.color][s.brightness]
            : this.api.off;
    }

    save() {
        Object.assign(this.saved, this.settings);
        return this;
    }

    revert() {
        Object.assign(this.settings, this.saved);
        this.update();
        return this;
    }

    update() {
        let color = (this.settings.on)
            ? this.getColor()
            : this.api.off;

        this.api.col(color, this.key);
    }

    show() {
        this.settings.on = true;
        this.update();
        return this;
    }

    off () {
        this.settings.color = 'off';
        return this.hide();
    }

    hide() {
        this.settings.on = false;
        this.update();
        return this;
    }

    toggle(color, brightness) {
        if (this.settings.color === color) {
            this.off();
            return false;
        } else {
            this.setColor(color, brightness);
            return true;
        }
    }

    flash (bool, time, speed) {
        speed = speed || 200;
        if (bool) {
            this.flashTimer = setInterval(() => {
                this.settings.flashing = true;
                if (this.settings.on) {
                    this.hide();
                } else {
                    this.show();
                }
            }, speed);
            if (time > 0) {
                setTimeout(() => {
                    this.flash(false);
                    this.revert();
                }, time);
            }
        } else {
            clearInterval(this.flashTimer);
            this.settings.flashing = false;
            this.revert();
        }
        return this;
    }

}