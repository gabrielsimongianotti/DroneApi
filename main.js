var WebSocketServer = require('websocket').server;
var http = require('http');
const app = require('express')();
require('dotenv').config();
const port = process.env.PORT ?? 3000;
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
  let state = false;

  let client = request.accept(null, request.origin);

  client.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log("oi", message.utf8Data);
      client.sendUTF(state ? "ON" : "OFF");
      client.sendUTF(message.utf8Data);
    }
  });
  let interval = () => {
    client.sendUTF(state ? "ON" : "OFF");
    state = !state;
  };
  client.on('close', () => {
    console.log("Conexão fechada");
    clearInterval(interval);
  });
});