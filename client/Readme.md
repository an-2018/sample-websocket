# Simple websocket client chat

## Install
 ``` bash
 npm install http-server
 ```

 ## Run
 ```bash
  http-server -<port> 
```

## Docker build steps
```bash
docker build -t <name of docker image> .

docker run -d -p 8083:80 <name of docker image>
```

Here its used the port 8083 for the client