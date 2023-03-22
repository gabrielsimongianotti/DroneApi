var WebSocketServer = require('websocket').server;
var http = require('http');
const app = require('express')();
var fs = require('fs');
const dayjs = require('dayjs')

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
    let table =[];
    console.log(fs.readFileSync('./drone.json').length)
    table = fs.readFileSync('./drone.json').length?JSON.parse(fs.readFileSync('./drone.json')) : []
    client.on('message', (message) => {
        if (message.type === 'utf8') {
        
          
            const str =message.utf8Data;
            const parts = str.split(',');
            const sat = parts[0].split(':')[1];
            const lat = parts[1].split(':')[1];
            const lng = parts[2].split(':')[1];
            state = { sat, lat, lng, date: dayjs( new Date()).format('DD/MM/YYYY'), time: dayjs( new Date()).format('HH:mm:ss')  }
            table.push(state);
            console.log(table)
            fs.writeFileSync('./drone.json', JSON.stringify(table))
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