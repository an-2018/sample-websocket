# Electron DesktopApp with js
### Sample HTML
```html
<h2>Using Electron for Desktop</h2>
    We are using node <script>document.write(process.versions.node)</script>,
    Chrome <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.
```

# Websocket Web Client Application
[MDN web Docs WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)

## Crating a websocket Object
```js
websocket = new webScoket(url, protocol);
```
**url** - the ```wss://``` url scheme or ```ws:://``` for local connections.
**protocol** - string used to indicate sub-protocols, so that a single server can implement diferent protocols.

### Error handler
**error** event is sent to th wesocket objet and trigger the ```onerror``` handler, and then the **CloseEvent** is sent to the objet wich trigger the ```onclose``` event.

### Examples

```js
var mySocket = new WebSocket("ws://example.com/socketServer", "protocolOne");
```
The protocol can be an array of protocols, like ```...["protocol1","protocol2"]...```.

## Sending data to server
Call websocket's object send() method:
```js
mySocket.send("Message to be sent to the server!");
```
To handle possible failures in the websocket connection, due to the asynchronous process, the best pratice is to define an **onopen** event handler:
```js
mySocket.onopen = function(event){
    mySocket.send("Message after onopen even");
}
```

### JSON to transmit objets
Using JSON to send more complex data to the server, like sending packets of JSON-encapsulated data:
```js
// send text to all users throught the server
function sendText(){
    // construct the msg
    var msg = {
        type: "message",
        text: document.getElementById("text").value,
        id: clientID,
        date: Date.now()
    };

    // send message objet as a JSON-formated string
    mySocket.send(JSON.stringfy(msg));

    // empty the input  field
    document.getElementById("text").value = "";
}
```
## Receiving messages from server
Whe a message is received a ```message```envent is sent to the websocket object, messages are envents, it can be hadled by an event listener or by an event handler.
```js
mySocket.onmessage = function(event){
    console.log(event.data);
}
```

### Interpreting JSON objets
There is some types of messages that could be sent througth the JSON objet
- Login handshake
- Message text
- User list updates

```js
mySocket.onmessage = function(event) {
    var f = document.getElelementById("chatbox").contentDocument;
    var text = "";
    var msg = JSON.parse(event.data);
    var time = new Date(msg.date);
    var timeStr = time.toLocaleTimeString();
    
    switch(msg.type){
        
        case: "id":
            clientID = msg.id;
            //handleUserData();
        break;
        
        case: "username":
            text = "<b> User : <em>" + msg.name + "</em> signed in at " + timeStr + "</b><b>"
        break;
        
        case: "message":
            text = "(" + timeStr + ") <b>" + msg.name + "</b> <b>" + msg.text + "</b>"; 
        break;
        
        case: "rejectusername":
            text = "<b>Your username has been set to <em>" + msg.name + "</em> because the name is already in use";
        break;
        
        case: "userlist":
            var ul = "";
            for(i=0; i < msg.users.length; i++){
                ul += msg.usets[i] + "<b>"
            }
            document.getElementById("useListBox").innerHTML = ul;
            break;

        break;
    }

    if(text.length){
        f.write(text);
        document.getELelementById("chattbox").innerWindow.scroolByPages(1);
    }
};
```

### Closing connection

```js
mySocket.close();
```
# Websocket Client/Server Node Application

## Client Node Example
[Websocket Client & Server Implementation for Node](https://github.com/theturtle32/WebSocket-Node)



## Socket Events emitter
[Aplicações Real Time com Node.js](https://blog.getty.io/aplica%C3%A7%C3%B5es-real-time-com-node-js-8389dae329be)
É possível emitir eventos para apenas o usuário específico conectado naquele socket através de **socket.emit**, notificar todos os usuários que estão conectados através de **io.emit**, e notificar ```todos os  usuários conectados, exceto você```, através de **socket.broadcast.emit**.

```js
io.on('connect', function(socket) {
  // irá notificar apenas o usuário
  socket.emit('hello', 'world'); 
  // irá notificar todos, inclusive você
  io.emit('novo usuario', 'NOME_USUARIO entrou na sala!');
 
  // irá notificar todos, exceto você
  socket.broadcast.emit('hello', 'novo usuário conectado');
});
```
