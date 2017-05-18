
import {Controls} from './controls';

export class TopControls extends Controls {

    constructor () {
        super();
        this.pads = this.device.pads.top;
        this.btns = {
            1: this.pads['08'],
            2: this.pads['18'],
            3: this.pads['28'],
            4: this.pads['38'],
            5: this.pads['48'],
            6: this.pads['58'],
            7: this.pads['68'],
            8: this.pads['78'],
        };
    }

}