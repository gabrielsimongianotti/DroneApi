var WebSocketServer = require('websocket').server;
var http = require('http');
const app = require('express')();
require('dotenv').config()
const port =process.env.PORT ?? 3000;
var server = http.createServer(app);

server.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', (request) => {
    let state = {};

    let client = request.accept(null, request.origin);

    client.on('message', (message) => {
        if (message.type === 'utf8') {
        
          
            const str =message.utf8Data;
            const parts = str.split(',');
            const sat = parts[0].split(':')[1];
            const lat = parts[1].split(':')[1];
            const lng = parts[2].split(':')[1];
            state = { sat, lat, lng }
            client.sendUTF("state");
        }
    });
    client.on(' statusDrone', (message) => {
        
        client.sendUTF(state);
        
    });
    let interval =() => {
        client.sendUTF(state);
    };
    client.on('close', () => {
        console.log("Conexão fechada");
        clearInterval(interval);
    });
});
