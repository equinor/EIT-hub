
const ws = new WebSocket("ws://localhost:80");
var desc = null;
var descOld = null;
var msg = {name: null, desc: null}
var peer = null;
var startButton = null;
var closeButton = null;

function startup() {
  startButton = document.getElementById("Start");
  closeButton = document.getElementById("Close");

  startButton.addEventListener('click', sendStart, false);
  closeButton.addEventListener('click', sendClose, false);

  startButton.disabled = true;
  closeButton.disabled = true;
}

ws.addEventListener('open', () => {
  console.log("We are connected");
  ping();
  setTimeout(wfd,3000);
});

function ping(){
  msg.name = "ping";
  ws.send(JSON.stringify(msg));
}

// wait for device stream to enable button (only valid for first connection)
function wfd(){
  startButton.disabled = false;
}

function sendStart() {
  msg.name = "Start";
  ws.send(JSON.stringify(msg));
  connectPeer();
  startButton.disabled = true;
  console.log("Starting stream");
}

function sendClose() {
  msg.name = "Close"
  ws.send(JSON.stringify(msg));
  desc = null;
  peer.destroy();
  startButton.disabled = false;
  closeButton.disabled = true;
  console.log("Steam stopped");
}

function submitSDP(desc) {
  if (desc != descOld) {
    console.log(desc);
    peer.signal(JSON.parse(desc));
    console.log("Recived SDP from server");
    descOld = desc;
  }
}

function connectPeer() {
  peer = new SimplePeer({
    trickle: false
  });

  peer.on('error', err => console.log('error', err));

  peer.on('signal', data => {
    console.log(JSON.stringify(data));
    desc = JSON.stringify(data);
    msg.name = "ClientSDP";
    msg.desc = desc;
    ws.send(JSON.stringify(msg));
    console.log("Sent SDP");
  });

  peer.on('stream', stream => {
    var video = document.querySelector("video");
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      console.log("Could not show stream");
    }
    video.play();
    closeButton.disabled = false;
  });

}

// Handles messages from server
ws.addEventListener('message', ev => {
  console.log(ev.data);
  if (ev.data == "pong") {
    setTimeout(ping, 15000);
  } else {
    desc = ev.data;
    submitSDP(desc);
  }
});

window.addEventListener('load', startup, false);

window.onclose = function () {
  peer.destroy();
}
