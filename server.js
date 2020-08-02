import express from 'express';
import bodyParser from 'body-Parser';
import morgan from 'morgan';
import socketio from 'socket.io';
import http from 'http';
const app = express();
app.use(morga('dev'));
app.use(bodyParser.urlencoded({extend:true}));
app.use(bodyParser.json());

app.get('/', (req,res) => res.json({hello:'world'}));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', () => console.log('someone connected'));

io.on('connect', function(socket){
    socket.emit('hello','someaction');
});

const port = process.env.Port || 3000;
server.listen(port, () => console.log(`[x] Magic happens on port : ${port}`));

export default app;