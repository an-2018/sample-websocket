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
# Websocket server
## Client handshake request
The client will send a pretty standard HTTP request with headers that looks like this (the HTTP version must be 1.1 or greater, and the method must be GET):
```
GET /chat HTTP/1.1
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```
If any header is not understood or has an incorrect value, the server should send a 400 ("Bad Request")} response and immediately close the socket.

## Server handshake response

When the server receives the handshake request, it should send back a special response that indicates that the protocol will be changing from HTTP to WebSocket. That header looks something like the following (remember each header line ends with \r\n and put an extra \r\n after the last one to indicate the end of the header):

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

# Refeerences
[Securityy in websocket Considerations - RFC 6455 Capter 10](https://datatracker.ietf.org/doc/rfc6455/?include_text=1)
**Websocket Implementations**
[ws: a Node.js WebSocket library](https://github.com/websockets/ws)
[ClusterWS Build Scalable Node.js WebSocket Applications](https://github.com/ClusterWS/ClusterWS/wiki)

# Notes
### 
Read the latest official **WebSockets specification**,**RFC 6455**. Sections 1 and 4-7 are especially interesting to server implementors. Section 10 discusses **security** and you should definitely peruse it before exposing your server.
### 
All browsers send an Origin header. You can use this header for security (checking for same origin, automatically allowing or denying, etc.) and send a **403 Forbidden** if you don't like what you see. However, be warned that non-browser agents can send a faked Origin. Most applications reject requests without this header.
### 
**Keeping track of clients**
you might keep a table of usernames or ID numbers along with the corresponding WebSocket and other data that you need to associate with that connection.


### 
**Client example**
```html
<!doctype html>
<style>
    textarea { vertical-align: bottom; }
    #output { overflow: auto; }
    #output > p { overflow-wrap: break-word; }
    #output span { color: blue; }
    #output span.error { color: red; }
</style>
<h2>WebSocket Test</h2>
<textarea cols=60 rows=6></textarea>
<button>send</button>
<div id=output></div>
<script>
    // http://www.websocket.org/echo.html

    var button = document.querySelector("button"),
        output = document.querySelector("#output"),
        textarea = document.querySelector("textarea"),
        // wsUri = "ws://echo.websocket.org/",
        wsUri = "ws://127.0.0.1/",
        websocket = new WebSocket(wsUri);

    button.addEventListener("click", onClickButton);

    websocket.onopen = function (e) {
        writeToScreen("CONNECTED");
        doSend("WebSocket rocks");
    };

    websocket.onclose = function (e) {
        writeToScreen("DISCONNECTED");
    };

    websocket.onmessage = function (e) {
        writeToScreen("<span>RESPONSE: " + e.data + "</span>");
    };

    websocket.onerror = function (e) {
        writeToScreen("<span class=error>ERROR:</span> " + e.data);
    };

    function doSend(message) {
        writeToScreen("SENT: " + message);
        websocket.send(message);
    }

    function writeToScreen(message) {
        output.insertAdjacentHTML("afterbegin", "<p>" + message + "</p>");
    }

    function onClickButton() {
        var text = textarea.value;

        text && doSend(text);
        textarea.value = "";
        textarea.focus();
    }
</script>
```