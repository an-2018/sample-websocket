# Implementation of WS server
[ws: a Node.js WebSocket library](https://github.com/websockets/ws)

### Instalation
```bash
npm install ws
npm install --save-optional bufferutil
npm install --save-optional utf-8-validate
```

- npm install --save-optional bufferutil: Allows to efficiently perform operations such as masking and unmasking the data payload of the WebSocket frames.
- npm install --save-optional utf-8-validate: Allows to efficiently check if a message contains valid UTF-8 as required by the spec.
### Sample Server
```js
const WebSocket = require('ws');

const wss = new webSocket.Server({port:8080});

wss.on('connection', function connection(ws){
    ws.on('message', function incoming(message){
        console.log('received: %s', message);
    });

    ws.send('Message received')
})
```
### External HTTP/S server
```js
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('/path/to/cert.pem'),
  key: fs.readFileSync('/path/to/key.pem')
});
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(8080);
```

### A client WebSocket broadcasting to every other connected WebSocket clients, excluding itself.

```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
```

### How to get the IP address of the client?
The remote IP address can be obtained from the raw socket.
```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
});
```

When the server runs behind a proxy like NGINX, the de-facto standard is to use the X-Forwarded-For header.
```js
wss.on('connection', function connection(ws, req) {
  const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
});
```

### How to detect and close broken connections?
Sometimes the link between the server and the client can be interrupted in a way that keeps both the server and the client unaware of the broken state of the connection (e.g. when pulling the cord).

In these cases ping messages can be used as a means to verify that the remote endpoint is still responsive.
```js
const WebSocket = require('ws');

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});
```

### A simple ping client implementation
```js
const WebSocket = require('ws');

function heartbeat() {
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);
}

const client = new WebSocket('wss://echo.websocket.org/');

client.on('open', heartbeat);
client.on('ping', heartbeat);
client.on('close', function clear() {
  clearTimeout(this.pingTimeout);
});
```