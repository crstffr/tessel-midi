import {Launchpad} from './class/launchpad';
import {WebServer} from './class/webServer';
import {EventServer} from './class/eventServer';
import {EventClient} from './class/eventClient';
import {Stream} from './class/eventStream';
import {SequencerView} from './views/sequencer/sequencer.view';

const esp = EventServer.path;

EventServer.start();
WebServer.start(esp);
EventClient.start(esp);
Stream.start();

Stream.on('get.everything').respondWith('everything');

Launchpad.connect().then(function() {

    Launchpad.reset(0);

    let views = {
        sequencer: new SequencerView()
    };

    views.sequencer.activate();

}).catch((e) => {
    console.log(e);
});