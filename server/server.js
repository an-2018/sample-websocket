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

wss.on('connection', function (ws, req) {
    const id = setInterval(function () {
        //
        // Ignore errors.
        //
    }, 100);
    const ip = req.connection.remoteAddress;
    console.log("started client interval with ip:%s",ip);
  
    ws.on('message', function incoming(data){
       // TODO: implement JSON parser
        const timeReceived = new Date();
        console.log('Message received at %s: %s',timeReceived.getTime(), data);
        //ws.send(`message received at: ${timeReceived}`);

        // Brodcast message to all clients
        wss.clients.forEach( function each(client){
            console.log("Sending message to all clients");
            if(ws != client && client.readyState === WebSocket.OPEN){
                client.send(data)
            }
        })

    });

    

    ws.on('close', function () {
      console.log('stopping client interval');
      clearInterval(id);
    });
  });

  server.listen(port, function () {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
      console.log(`Listening on http://${add}:${port}`);
    })
  });

  