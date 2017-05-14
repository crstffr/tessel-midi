import {Launchpad} from './class/launchpad';
import {SequencerView} from './views/sequencer/sequencer.view';

Launchpad.connect().then(function() {

    Launchpad.reset(0);

    let views = {
        sequencer: new SequencerView()
    };

    views.sequencer.activate();
});