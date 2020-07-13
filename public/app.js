

export default function webApp(websocket, gamePad, keyboard) {
  const clientCountText = document.getElementById('clientCount');
  const listOfClients = document.getElementById('listOfDevices');
  const controlText = document.getElementById("requestAnswer");
  const myIDtext = document.getElementById("myID");
  const dataText = document.getElementById("dataText");

  websocket.onControl(function(msg) {

  })


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

  document.getElementById("submit").onclick = function() { // Send password and request control
      var pass = document.getElementById("userPass").value;
      var msg = {
          type: "requestControl",
          pass: pass,
          id: myID,
      }
      console.log('sent request!' + msg.pass);
      ws.sendControlRequest();
      
  }

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

  var x, y, z, r;

  function getInputs() {
      x = y = z = r = 0;

      if (gamepadButton) {
        var gp = gamePad.getAxis();
        y = gp.axes[1];
        x = gp.axes[0];
        z = gp.axes[3];
        r = gp.axes[2];

      } else if (keyobardButton) { // have to change later for smoother control
        if (keyboard.keyW()) {
            y = 1;
        }
        if (keyboard.keyA()) {
            x = -1;
        }
        if (keyboard.keyS()) {
            y = -1;
        }
        if (keyboard.keyD()) {
            x = 1;
        } 
        if (keyboard.keyUp()) {
            z = 1;
      }
        if (keyboard.keyLeft()) {
            r = -1;
      }
        if (keyboard.keyDown()) {
            z = -1;
      }
        if (keyboard.keyRight()) {
            r = 1;
      } 
      }
      console.log(x,y,z,r);


      websocket.sendInput({x:x,y:y,z:z,r:r})
      
      // Display controls in html
      dataText.innerText = "x:" + x + "  y:" + y + "  z:" + z + " r:" + r;
  }

  // Gets inputs every 10ms
  setInterval(getInputs, 10);

}