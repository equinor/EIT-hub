const clientCountText = document.getElementById('clientCount');
const listOfClients = document.getElementById('listOfDevices');
const controlText = document.getElementById("requestAnswer");
const myIDtext = document.getElementById("myID");

var myID = 0;
var clients = new Array(10).fill(0);
var clientCount = 0;
var youInControl = false;

// Websocket

function updateClients(msg) {
    clientID = msg.id;
            if (clients[clientID - 1] === 0) {
                clients[clientID - 1] = clientID;
                clientCount += 1;
            }
            clientCountText.innerText = clientCount === 1 ? `${clientCount} client` : `${clientCount} clients`;
}


ws = new WebSocket('ws://localhost:3000');

ws.onopen = function() {
    var msg = {
        type: "newClient",
        text: null,
        id:   null,
        date: Date.now()
    };
    console.log('Connection opened!');
    ws.send(JSON.stringify(msg));
    clientCount += 1;
    clientCountText.innerText = clientCount === 1 ? `${clientCount} client` : `${clientCount} clients`;
};

ws.onmessage = function(event) {
    var msg = JSON.parse(event.data);
 
    switch(msg.type) {
        case "newClient":
            updateClients(msg);
            break;
        case "youNewClient":
            myID = msg.id;
            myIDtext.innerText = myID;
            clientCount = msg.clientCount;
            clients = msg.clientList;
            clientCountText.innerText = clientCount === 1 ? `${clientCount} client` : `${clientCount} clients`;
            break;

        case "closeClient": // Does not work yet
            closeID = msg.id
            clients[msg.id - 1] = 0;
            clientCount -= 1;
            clientCountText.innerText = clientCount === 1 ? `${clientCount} client` : `${clientCount} clients`;
            break;

        case "requestAnswer":
            console.log('got request answer' + msg.control);
            if (msg.control === true) {
                controlText.innerText = "You have control"
                youInControl = true;
            } else {
                controlText.innerText = "Wrong password"
                youInControl = false;
            }
            break;

        case "controls":
            console.log('got controls' + msg.y + msg.x);
            y = msg.y;
            x = msg.x;
            break;
    }
};

document.getElementById("submit").onclick = function() {
    var pass = document.getElementById("userPass").value;
    var msg = {
        type: "requestControl",
        pass: pass,
        id: myID,
    }
    console.log('sent request!' + msg.pass);
    ws.send(JSON.stringify(msg));
    
  }

/*window.onunload = function(){
    ws.onclose = function() {
        var msg = {
            type: "closeClient",
            text: null,
            id:   myID,
            date: Date.now()
        };
        console.log('Connection closed!');
        ws.send(JSON.stringify(msg));
        ws = null;
    }
 } */

// Controller !!!!!

var gamepadButton = false;
var keyobardButton = false;

document.getElementById("gamepad-button").onclick = function() {
  gamepadButton = true;
  keyobardButton = false;
}
document.getElementById("keyboard-button").onclick = function() {
  keyobardButton = true;
  gamepadButton = false;

}
var gamepadInfo = document.getElementById("gamepad-info");
var ball = document.getElementById("ball");

var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var y_axes = 0;
var x_axes = 0;

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d
      keyD = true;
      break;
    case 83: //s
      keyS = true;
      break;
    case 65: //a
      keyA = true;
      break;
    case 87: //w
      keyW = true;
      break;
  }
}

function onKeyUp(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d
      keyD = false;
      break;
    case 83: //s
      keyS = false;
      break;
    case 65: //a
      keyA = false;
      break;
    case 87: //w
      keyW = false;
      break;
  }
}

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-50;

function drawBall() {
    if (gamepadButton) {
      gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
      var gp = gamepads[0];
      y += gp.axes[1];
      x += gp.axes[0];
    } else if (keyobardButton) {
      if (keyW) {
          y--;
      }
      if (keyA) {
          x--;
      }
      if (keyS) {
          y++;
      }
      if (keyD) {
          x++;
      } 
    }

    if (youInControl) {
      var msg = {
        type: "controls",
        id: myID,
        y: y,
        x: x,
      };
      ws.send(JSON.stringify(msg));
      console.log("Sent controls",msg.x,msg.y );
    }

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI*2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
}

setInterval(draw, 10);
