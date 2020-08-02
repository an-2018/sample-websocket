require('dotenv').config();
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({extend:true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
  });

const server = http.createServer(app);

const port = process.env.PORT;

const wss = new WebSocket.Server({server});

wss.on('connection', function (ws) {
    const id = setInterval(function () {
      ws.send(JSON.stringify(process.memoryUsage()), function () {
        //
        // Ignore errors.
        //
      });
    }, 100);
    console.log('started client interval');
  
    ws.on('message', function incoming(event){
        const timeReceived = new Date;
        const data = JSON.parse(event.data);
        console.log('Timestamp at - %s - received: %s',timeReceived, data.message);
    });

    ws.send(`message received at: ${timeReceived}`)

    ws.on('close', function () {
      console.log('stopping client interval');
      clearInterval(id);
    });
  });

server.listen(port, function () {
    console.log(`Listening on http://localhost:${port}`);
  });

 /*
const express = require('express')
const app = express()
const port = 4001

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(0, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})*/