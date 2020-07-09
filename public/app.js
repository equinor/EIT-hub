
function webApp() {

  const clientCountText = document.getElementById('clientCount');
  const listOfClients = document.getElementById('listOfDevices');
  const controlText = document.getElementById("requestAnswer");
  const myIDtext = document.getElementById("myID");
  const dataText = document.getElementById("dataText");


  var myID = 0;
  var clients = new Array(10).fill(0); // Max 10 client ID
  var clientCount = 0;
  var youInControl = false;

  // ---------------Websocket-----------------

  function updateClients(msg) {
      clientID = msg.id;
              if (clients[clientID - 1] === 0) {
                  clients[clientID - 1] = clientID;
                  clientCount += 1;
              }
              clientCountText.innerText = clientCount === 1 ? `${clientCount} client` : `${clientCount} clients`;
  }

  ws = new WebSocket('ws://localhost:3000');

  ws.onopen = function() { // When the websocket opens
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

  ws.onmessage = function(event) { // When message is received
      var msg = JSON.parse(event.data);
  
      switch(msg.type) {

          case "newClient": // When a new client connects to server
              updateClients(msg);
              break;

          case "youNewClient": // If you are new client, receives number of clients online
              myID = msg.id;
              myIDtext.innerText = myID;
              clientCount = msg.clientCount;
              clients = msg.clientList;
              clientCountText.innerText = clientCount === 1 ? `${clientCount} client` : `${clientCount} clients`;
              break;

          /*case "closeClient": //When another client disconnects, does not work yet
              closeID = msg.id
              clients[msg.id - 1] = 0;
              clientCount -= 1;
              clientCountText.innerText = clientCount === 1 ? `${clientCount} client` : `${clientCount} clients`;
              break; */

          case "requestAnswer": // Answer if you got control or not
              console.log('got request answer' + msg.control);
              if (msg.control === true) {
                  controlText.innerText = "You have control"
                  youInControl = true;
              } else {
                  controlText.innerText = "Wrong password"
                  youInControl = false;
              }
              break;
          /*  //
          case "controls":
              console.log('got controls' + msg.y + msg.x);
              y = msg.y;
              x = msg.x;
              break; */
      }
  };

  document.getElementById("submit").onclick = function() { // Send password and request control
      var pass = document.getElementById("userPass").value;
      var msg = {
          type: "requestControl",
          pass: pass,
          id: myID,
      }
      console.log('sent request!' + msg.pass);
      ws.send(JSON.stringify(msg));
      
    }
  // If client closes browser, does not work yet
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

  // -------------------Controller-----------------

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

  var keyW, keyA, keyS, keyD, keyUp, keyLeft, keyDown, keyRight;
  keyW = keyA = keyS = keyD = keyUp = keyLeft = keyDown = keyRight = false;

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
      case 37: //left arrow
        keyLeft = true;
        break;
      case 38: //up arrow
        keyUp = true;
        break;
      case 39: //right arrow
        keyRight = true;
        break;
      case 40: //down arrow
        keyDown = true;
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
      case 37: //left arrow
        keyLeft = false;
        break;
      case 38: //up arrow
        keyUp = false;
        break;
      case 39: //right arrow
        keyRight = false;
        break;
      case 40: //down arrow
        keyDown = false;
        break;
    }
  }

  var x, y, z, r;

  function getInputs() {
      x = y = z = r = 0;

      if (gamepadButton) {
        gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        var gp = gamepads[0];
        y = gp.axes[1];
        x = gp.axes[0];
        z = gp.axes[3];
        r = gp.axes[2];

      } else if (keyobardButton) { // have to change later for smoother control
        if (keyW) {
            y = 1;
        }
        if (keyA) {
            x = -1;
        }
        if (keyS) {
            y = -1;
        }
        if (keyD) {
            x = 1;
        } 
        if (keyUp) {
            z = 1;
      }
        if (keyLeft) {
            r = -1;
      }
        if (keyDown) {
            z = -1;
      }
        if (keyRight) {
            r = 1;
      } 
      }
      console.log(x,y,z,r);

      // Send inputs to server if you are in control
      if (youInControl) {
        var msg = {
          type: "controls",
          id: myID,
          y: y,
          x: x,
          z: z,
          r: r,
        };
        ws.send(JSON.stringify(msg));
      
      }
      // Display controls in html
      dataText.innerText = "x:" + x + "  y:" + y + "  z:" + z + " r:" + r;
  }

  // Gets inputs every 10ms
  setInterval(getInputs, 10);

}

webApp();