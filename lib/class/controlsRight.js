
import {Controls} from './controls';

export class RightControls extends Controls {

    constructor () {
        super();
        this.pads = this.device.pads.right;
        this.btns = {
            A: this.pads['80'],
            B: this.pads['81'],
            C: this.pads['82'],
            D: this.pads['83'],
            E: this.pads['84'],
            F: this.pads['85'],
            G: this.pads['86'],
            H: this.pads['87'],
        };
    }

}