import {Utils} from './utils';
import {Sequencer} from './sequencer';
import {GridControls} from './controlsGrid';

export class CursorControls extends GridControls {

    constructor () {
        super();

        this.pos = 0;
        this.page = 0;

        this.iterate((pad) => {
            pad.define({playCursor: {
                color: 'green'
            }});
        });

    }

}