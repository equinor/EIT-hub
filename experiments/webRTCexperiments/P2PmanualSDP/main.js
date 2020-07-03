

window.onload = function(){
if (location.hash == '#1') {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false}).then(connect).catch(() => { });
  }
}

function connect(stream) {
  const peer = new SimplePeer({
    initiator: location.hash === '#1',
    stream: stream,
    trickle: false
  });

  peer.on('error', err => console.log('error', err));

  peer.on('signal', data => {
    console.log('SIGNAL', JSON.stringify(data));
    document.querySelector('#outgoing').textContent = JSON.stringify(data);
  });

  document.querySelector('form').addEventListener('submit', ev => {
    ev.preventDefault();
    peer.signal(JSON.parse(document.querySelector('#incoming').value));
    document.querySelector('#incoming').value = "";
  });
}
if (location.hash != '#1') {
  const peer = new SimplePeer({
    trickle: false
  });

  peer.on('error', err => console.log('error', err));

  peer.on('signal', data => {
    console.log('SIGNAL', JSON.stringify(data));
    document.querySelector('#outgoing').textContent = JSON.stringify(data);
  });

  document.querySelector('form').addEventListener('submit', ev => {
    ev.preventDefault();
    peer.signal(JSON.parse(document.querySelector('#incoming').value));
    document.querySelector('#incoming').value = "";
  });

  peer.on('stream', stream => {
    var video = document.querySelector('video');
    if ('srcObject' in video) {
      video.srcObject = stream;
    } else {
      console.log("Could not show stream");
    }
    video.play();
  });
}

