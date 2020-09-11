# Sample web server

## Install
```bash
npm install
```

## Run
```bash
npm start
```

## Requirements
The ws server run on por **3333**

## Docker build steps
```bash
docker build -t <name of docker image> .

# using docker repository (use docker username)
docker run --name <name of docker container> -p 80:8080 -d seu_usuário_dockerhub/<name of docker image> 

# using docker file image build
docker run --name <name of docker container> -p 80:8080 -d <name of docker image> 
```
