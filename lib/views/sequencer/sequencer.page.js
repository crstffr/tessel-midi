
import {Page} from '../../class/page';

export class SequencerPage extends Page {

    constructor (id) {
        super(id);
    }

    handleClick(pad) {
        pad.toggle('amber', 'low');
    }
}