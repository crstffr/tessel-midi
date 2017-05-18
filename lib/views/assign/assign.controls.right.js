import {RightControls} from '../../class/controlsRight';

export class AssignRightControls extends RightControls {

    constructor () {
        super();
        this.btns.play = this.btns['H'];
        this.btns.values = [
            this.btns['G'],
            this.btns['F'],
            this.btns['E'],
            this.btns['D'],
            this.btns['C'],
            this.btns['B'],
            this.btns['A'],
        ]
    }

    renderVelocity(length) {
        this.btns.values.forEach((btn, i) => {
            if (i + 1 <= length) {
                btn.setColor('amber');
            } else {
                btn.off();
            }
        });
    }

    onActivate() {
        this.btns.play.setColor('green');
    }

    onPress(pad) {

        if (pad === this.btns.play) {
            this.emit('play');
            return;
        }

        let i = this.btns.values.indexOf(pad);
        if (i > -1) {
            this.emit('setVelocity', i + 1);
        }

    }
}