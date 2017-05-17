import './style';

console.log('here', DEVICE);

let ws;
let wasopen;
let reconnect;

function connect() {

    try {

        ws = new WebSocket(DEVICE.ws, 'webClient');

        ws.onopen = () => {
            clearInterval(reconnect);
            let msg = JSON.stringify({topic: 'get.everything'});
            ws.send(msg);
            wasopen = true;
        };

        ws.onerror = () => {};

        ws.onclose = () => {
            console.log('is closed');
            if (wasopen) {
                wasopen = false;
                reconnect = setInterval(connect, 1000);
                setTimeout(() => {
                    clearInterval(reconnect);
                }, 30000);
            }
        };

        ws.onmessage = (msg) => {
            console.log('recd', msg.data);
        };

    } catch(e) {}

}

connect();
