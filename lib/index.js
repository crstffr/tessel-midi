import {Launchpad} from './class/launchpad';
import {WebServer} from './class/webServer';
import {EventServer} from './class/eventServer';
import {EventClient} from './class/eventClient';
import {EventStream} from './class/eventStream';

import {Router} from './class/router';
import {SequencerView} from './views/sequencer/sequencer.view';
import {AssignView} from './views/assign/assign.view';

const esp = EventServer.path;

EventServer.start();
WebServer.start(esp);
EventClient.start(esp);
EventStream.start();

EventStream.on('get.everything').respondWith('everything');

Launchpad.connect().then(function() {

    Launchpad.reset(0);

    Router.registerView('seq', new SequencerView());
    // Router.registerView('assign', new AssignView());

    Router.switchView('seq');

}).catch((e) => {
    console.log(e);
});