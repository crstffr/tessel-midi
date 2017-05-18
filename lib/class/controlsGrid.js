
import {Controls} from './controls';

export class GridControls extends Controls {

    constructor () {
        super();
        this.pads = this.device.pads.grid;
    }

}