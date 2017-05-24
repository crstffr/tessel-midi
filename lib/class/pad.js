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
        this.value = 0;
        this.state = 'off';
        this.key = [x, y];
        this.xy = String(x) + String(y);

        this.states = {};
        this._states = [];

        this.flashState = 0;
        this.flashTimer = 0;

        if (x === 8) {
            this.name = PAD_NAMES_RIGHT[y];
        }

        if (y === 8) {
            this.name = PAD_NAMES_TOP[x];
        }

        this.defaultSettings = {
            on: true,
            prev: 'off',
            color: 'off',
            flash: false,
            brightness: 'low',
        };

        let dblTimer = 0;
        let holdTimer = 0;
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

        this.define({off: {on: false}}).load('off');

    }

    getState(name) {
        return this.states[name] || {};
    }

    getSettings() {
        return this.states[this.state] || {};
    }

    define(obj) {
        Object.keys(obj).forEach((name) => {
            this.states[name] = Object.assign({}, this.defaultSettings, obj[name]);
        });
        return this;
    }

    update(name, settings) {
        this.states[name] = Object.assign({}, this.states[name], settings);
        return this;
    }

    load(name) {
        let prev = (name !== this.state) ? this.state : 'off';
        this.state = name;
        this.getSettings().prev = prev;
        this.render();
        return this;
    }

    getPrevSettings() {
        console.log('prev', this.getSettings().prev);
        return this.states[this.getSettings().prev];
    }

    loadPrev() {
        this.load(this.getSettings().prev);
        return this;
    }

    render() {
        let s = this.getSettings();
        if (!s) { return; }

        let color = (s.on)
            ? this.getColor(s)
            : this.api.off;

        if (!s.flash) {
            this.stopFlashing();
        } else if (!this.flashState) {
            this.startFlashing(s.flash.time, s.flash.delay);
        } else {
            let on = (this.flashState === 1);
            color = this.getFlashColor(on);
        }

        this.api.col(color, this.key);
        return this;
    }

    setColor () {
        return this;
    }

    getFlashColor(on) {
        let c = 'off';
        let s = this.getSettings();
        if (on) {
            if (s.flash.color && s.flash.brightness) {
                return this.getColor(s.flash);
            }
            return this.getColor(s);
        } else {
            if (!s.flash.off) {
                return this.getColor(this.getState('off'));
            }

            if (s.flash.off === 'prev') {
                return this.getColor(this.getPrevSettings());
            }

            return this.getColor(this.getState(s.flash.off));
        }
    }

    getColor (s) {
        return (s.color !== 'off')
            ? this.api[s.color][s.brightness]
            : this.api.off;
    }

    save() {
        return this;
    }

    revert() {
        return this;
    }

    show() {
        return this;
    }

    off () {
        this.load('off');
        return this;
    }

    hide() {
        return this;
    }

    toggle(color, brightness) {

    }

    flashOn() {

    }

    flashOff() {
        let s = this.getPrevSettings();

    }

    startFlashing(time, speed) {
        this.flashState = 1;
        this.flashTimer = setInterval(() => {
            this.flashState = (this.flashState === 1) ? 2 : 1;
            this.render();
        }, speed || 200);
        if (time > 0) {
            setTimeout(() => {
                this.stopFlashing();
                this.loadPrev();
            }, time);
        }
        return this;
    }

    stopFlashing() {
        clearInterval(this.flashTimer);
        this.flashState = 0;
        this.flashTimer = 0;
        return this;
    }

}