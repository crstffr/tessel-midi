import WebSocket from 'ws';

export class EventClientClass {

    constructor () {
        this.ready = false;
    }

    start(eventServerPath) {

        this.ws = new WebSocket(eventServerPath, 'devClient');

        this.ws.on('open', () => {
            this.ready = true;
        });

        this.ws.on('close', () => {
            this.ready = false;
        });
    }

    on(...args) {
        this.ws.on(...args);
    }

    send(...args) {
        if (!this.ready) { return; }
        this.ws.send(...args);
    }

}

export let EventClient = new EventClientClass();