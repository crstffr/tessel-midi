import WebSocket from 'ws';

export class EventClientClass {

    start(eventServerPath) {
        this.ws = new WebSocket(eventServerPath, 'devClient');
    }

    on(...args) {
        this.ws.on(...args);
    }

    send(...args) {
        this.ws.send(...args);
    }

}

export let EventClient = new EventClientClass();