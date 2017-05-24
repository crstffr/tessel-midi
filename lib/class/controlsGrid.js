import {Utils} from './utils';
import {Controls} from './controls';

export class GridControls extends Controls {

    constructor () {
        super();
        this.pads = this.device.pads.grid;
    }

    renderLength(start, length, currPage, padState) {
        if (!(start >= 0 && length >= 0)) { return; }
        let ppStart = Utils.getPagePadIndex(start);
        let ppEnd = Utils.getPagePadIndex(length);
        this.iterate((pad) => {
            let on = false;
            if (currPage > ppStart.page && currPage < ppEnd.page) {
                on = true;
            } else if (currPage < ppStart.page || currPage > ppEnd.page) {
                on = false;
            } else {
                on = true;
                if (currPage === ppStart.page) {
                    if (pad.value < ppStart.pad) {
                        on = false;
                    }
                }
                if (currPage === ppEnd.page) {
                    if (pad.value > ppEnd.pad) {
                        on = false;
                    }
                }
            }
            if (on) {
                pad.load(padState);
            } else {
                pad.load('off');
            }
        });
    }

}