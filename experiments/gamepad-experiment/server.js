const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 3000;

const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

var clients = new Array(10).fill(0);
var clientCount = 0;

const password = "123";
controlID = 0;

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        var msg = JSON.parse(data);
        
        switch(msg.type) {

            case "newClient":
                console.log('new')
                clientID = 0;
                clientCount += 1;
                for (var i = 0; i < clients.length; i++) {
                    if (clients[i] == 0) {
                        clientID = i + 1;
                        clients[i] = clientID;
                        break;
                    }
                }
                wss.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        msg.id = clientID;
                        client.send(JSON.stringify(msg));
                    } else if (client === ws) {
                        msg.id = clientID;
                        msg.type = "youNewClient"
                        msg.clientCount = clientCount;
                        msg.clientList = clients;
                        client.send(JSON.stringify(msg));
                    }
                });
                break;

            case "closeClient": // Does not work yet
                console.log('close');
                clients[msg.id-1] = 0;
                clientCount -= 1;
                
                wss.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(data);
                    }
                })
                break;


            case "requestControl":
                console.log('request');
                if (msg.pass === password){
                    controlID = msg.id;
                    msg = {
                        type: "requestAnswer",
                        control: true,
                    }
                } else {
                    msg = {
                        type: "requestAnswer",
                        control: false,
                    }
                }
                wss.clients.forEach(function each(client) {
                    if (client === ws && client.readyState === WebSocket.OPEN) {
                        msg.id = clientID;
                        client.send(JSON.stringify(msg));
                    } 
                });
                break;

            case "controls":
                if (msg.id === controlID){
                    wss.clients.forEach(function each(client) {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(data);
                        }
                    });
                }
            break;
        }
    });
  });

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
})
