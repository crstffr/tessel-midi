import events from 'events';

const PAD_NAMES_TOP = ['1','2','3','4','5','6','7','8'];
const PAD_NAMES_RIGHT = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

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
        this.name = '';
        this.key = [x, y];
        this.xy = String(x) + String(y);
        this.saved = {};

        if (x === 8) {
            this.name = PAD_NAMES_RIGHT[y];
        }

        if (y === 8) {
            this.name = PAD_NAMES_TOP[x];
        }

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

            this.emit('pushOn', this);

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

            this.emit('pushOff', this);

            if (!holding) {
                this.emit('click', this);
            } else {
                holding = false;
                this.emit('holdOff', this);
            }
            clearTimeout(holdTimer);
        });

    }

    setColor (color, brightness) {
        this.flash(false);
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
        return this;
    }

    show() {
        this.settings.on = true;
        this.update();
        return this;
    }

    off () {
        this.settings.color = 'off';
        this.flash(false);
        return this.hide();
    }

    hide() {
        this.settings.on = false;
        this.update();
        return this;
    }

    toggle(color, brightness) {
        if (this.settings.on) {
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