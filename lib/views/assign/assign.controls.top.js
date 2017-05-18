import {TopControls} from '../../class/controlsTop';

export class AssignTopControls extends TopControls {

    constructor () {
        super();
        this.btns.esc = this.btns[1];
        this.btns.values = [
            this.btns[2],
            this.btns[3],
            this.btns[4],
            this.btns[5],
            this.btns[6],
            this.btns[7],
            this.btns[8],
        ]
    }

    renderLength(length) {
        this.btns.values.forEach((btn, i) => {
            if (i + 1 <= length) {
                btn.setColor('green');
            } else {
                btn.off();
            }
        });
    }

    onActivate() {
        this.btns.esc.setColor('red');
    }

    onPress(pad) {

        if (pad === this.btns.esc) {
            this.emit('escape');
            return;
        }

        let i = this.btns.values.indexOf(pad);
        if (i > -1) {
            this.emit('setLength', i + 1);
        }

    }

}