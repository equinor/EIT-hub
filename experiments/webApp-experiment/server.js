const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 3000;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });
var client_count = 0;

wss.on('connection', function connection(ws) {
  ws.id = client_count;
  client_count += 1;
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // client.send("Client " + ws.id + ":  " + data);
        sendText(data, client, client.id);
      }
    })
  })
})

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
})

function sendText(sentText, ws, id) {

  var msg = {
    type: "message",
    text: sentText,
    id:   id,
    date: Date.now()
  };
  ws.send(JSON.stringify(msg));
}
