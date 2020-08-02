const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 888});

wss.on('connection', function connection(ws){
    ws.on('message', function incoming(event){
        const timeReceived = new Date;
        const data = JSON.parse(event.data);
        console.log('Timestamp at - %s - received: %s',timeReceived, data.message);
    });

    ws.send(`message received at: ${timeReceived}`)
});