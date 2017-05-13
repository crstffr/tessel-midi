import {Launchpad as Pad} from './class/launchpad';
import {SequencerView} from './views/sequencer/sequencer.view';

Pad.connect().then(function() {

    Pad.reset(0);

    let views = {
        sequencer: new SequencerView()
    };

    views.sequencer.activate();
});