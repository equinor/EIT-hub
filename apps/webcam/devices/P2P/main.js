/* eslint-disable */
// @ts-nocheck
navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(connect).catch(() => { });

window.onclose = function () {
  peer.destroy();
}

function connect(stream) {
  peer = new SimplePeer({
    initiator: true,
    stream: stream,
    trickle: false
  });

  peer.on('error', err => console.log('error', err));

  peer.on('signal', data => {
    console.log(JSON.stringify(data));
    document.querySelector('#outgoing').textContent = JSON.stringify(data);
  });

  document.querySelector('form').addEventListener('submit', ev => {
    ev.preventDefault();
    peer.signal(JSON.parse(document.querySelector('#incoming').value));
    document.querySelector('#incoming').value = "";
  });
}


