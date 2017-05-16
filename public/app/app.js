import './style';

console.log('here', DEVICE);

let ws = new WebSocket(DEVICE.ws, 'webClient');

ws.onopen = (event) => {
    console.log('is opened');
    ws.send('HI MOM');
};

ws.onmessage = (msg) => {
    console.log('recd', msg.data);
};