
import {Launchpad} from './launchpad';
import {EventHandler} from './eventHandler';


export class Pad {

    constructor (x, y, parent) {
        this.x = x;
        this.y = y;
        this.key = [x, y];
        this.parent = parent;
        this.color = Launchpad.off;
        this.value = 0;

        let clickHandler = new EventHandler();
        this.onClick = clickHandler.register;
        this.click = clickHandler.trigger;

        let holdHandler = new EventHandler();
        this.onHold = holdHandler.register;
        this.hold = holdHandler.trigger;

        Launchpad.on('key', (k) => {
            if (this.parent.active && k.pressed) {
                if (k.x === x && k.y === y) {
                    this.click(this);
                }
            }
        });

    }

    setColor (color, brightness) {
        this.color = Launchpad[color || 'amber'][brightness || 'full'];
        return this.show();
    }

    off () {
        this.color = Launchpad.off;
        return this.hide();
    }

    hide() {
        Launchpad.col(Launchpad.off, this.key);
        return this;
    }

    show() {
        Launchpad.col(this.color, this.key);
        return this;
    }

    toggle(color, brightness) {
        if (this.color._name === color) {
            this.off();
        } else {
            this.setColor(color, brightness)
        }
        return this;
    }

}