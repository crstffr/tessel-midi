import {Launchpad} from './class/launchpad';
import {WebServer} from './class/webServer';
import {EventServer} from './class/eventServer';
import {EventClient} from './class/eventClient';
import {SequencerView} from './views/sequencer/sequencer.view';

const es = EventServer.path;

WebServer.start(es);
EventServer.start();
EventClient.start(es);

EventClient.on('message', (msg) => {
    console.log('recd', msg);
    EventClient.send('HI DAD');
});


Launchpad.connect().then(function() {

    Launchpad.reset(0);

    let views = {
        sequencer: new SequencerView()
    };

    views.sequencer.activate();

}).catch((e) => {
    console.log(e);
});