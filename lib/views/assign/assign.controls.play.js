import {RightControls} from '../../class/controlsRight';

export class AssignPlayControls extends RightControls {

    constructor () {
        super();

        this.selectPads((pad) => {
            return pad.value >= 3;
        });

        this.btns.rec = this.btns['G'];
        this.btns.play = this.btns['H'];

    }

    onActivate() {
        this.btns.rec.setColor('red');
        this.btns.play.setColor('green');
    }

    onPress(pad) {
        switch(pad) {
            case this.btns.rec:
                switch(this.state) {
                    case 'ready':
                        this.state = 'record';
                        this.btns.rec.setColor('red').flash(true);
                        this.emit('setModeRecord');
                        break;
                    case 'record':
                        this.state = 'ready';
                        this.btns.rec.flash(false).setColor('red');
                        this.emit('setModePlay');
                }
                break;
            case this.btns.play:
                this.emit('playStep');
                break;
        }
    }
}