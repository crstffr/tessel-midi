import ip from 'ip';
import WebSocket from 'ws';


class EventServerClass {

    constructor () {
        this.port = 9201;
        this.ip = ip.address();
        this.path = `ws://${this.ip}:${this.port}`;
    }

    start() {

        this.wss = new WebSocket.Server({port: this.port});

        this.wss.on('connection', (conn) => {
            conn.on('message', (msg) => {
                this.wss.clients.forEach((client) => {
                    if (client !== conn && client.readyState === WebSocket.OPEN) {
                        client.send(msg);
                    }
                });
            });
        });

        console.log(`EventServer now running at ${this.path}`);
    }

}

export let EventServer = new EventServerClass();