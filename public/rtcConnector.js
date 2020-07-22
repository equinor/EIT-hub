import './simplepeer.min.js';

export default class RtcConnector {
    constructor(websocket, videoView) {
        this._websocket = websocket;
        this._videoView = videoView;
        this._devices = null; // This supports several streams, however you will need to add option of choosing video tag in video-view and add video tag in html file (I think, needs testing) also modyfy text output and button 
        this._peers = {};
        this._streams = {};
        this._first = {}; 
    }

    start() {

        let self = this;

        self._websocket.onRtc(function (msg) {
            let Type = msg.data.type;
            let strDev = msg.data.Device;
            let message = msg.data.message

            // Listen for the stream from the device to start, then the client will request a peer connection to backend 
            if (Type === "Status"){
                if (message === false){
                    self._videoView.setStatus(`The device: ${self._devices[strDev]} is not streaming`);

                } else if (message === true) {
                    self._videoView.setStatus(`The device: ${self._devices[strDev]} is streaming`);

                    if (self._first[strDev] === true){
                        self._videoView.setStatus(`The device: ${self._devices[strDev]} is streaming. Takes a few moments to show`);
                        self._websocket.sendRtc({data: {type: "SDPrequest", message: null, Device: strDev}});
                        self._first[strDev] = false;
                    }
                } else if (message === "off"){
                    self._videoView.setStatus(`The Device: ${self._devices[strDev]} is off`);
                }

            // Creates peers based on nuber of devices (sent from backend)
            } else if(Type === "Devices") {
                self._devices = message;
                for (const property in self._devices){
                    self._peers[property] = new SimplePeer({
                        trickle: false
                    });
                    self._peers[property].on('error', err => console.log('error', err));
                    self._peers[property].on('signal', data => {
                        self._websocket.sendRtc({data: {type: "SDP", message: data, Device: property}});
                    });
                    self._peers[property].on('stream', stream => { 
                        self._streams[property] = stream;
                        self._videoView.setStream(self._streams[property]);
                    });

                    self._first[property] = true;

                }
            // Submits backend SDP
            } else if (Type === "SDP") {
                console.log(strDev);
                self._peers[strDev].signal(JSON.parse(message));

            } else if (Type === "message") {
                self._videoView.setStatus("No stream devices given");
            }

        });

        window.onclose = function () {
            self._peers.destroy();
            self._streams = {};
        }

    }
} 