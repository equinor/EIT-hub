/* eslint-disable */
// @ts-nocheck
/* istanbul ignore file */
import './simplepeer.min.js';

export default class RtcConnector {
    constructor(websocket, videoView) {
        this._websocket = websocket;
        this._videoView = videoView;
        this._devices = null; // This supports several streams, however you will need to add option of choosing video tag in video-view and add video tag in html file (I think, needs testing) also modyfy text output and button 
        this._peers = {};
        this._streams = {};
        this._tags = {};
        this._first = {};
        this._sdp = {};
        this._ans = {};
        this._regDone = {};
    }

    start() {

        let self = this;
    

        self._websocket.onRtc(function (msg) {
            let Type = msg.data.type;
            let strDev = msg.data.Device;
            let message = msg.data.message

            // Listen for the stream from the device to start, then the client will request a peer connection to backend 
            if (Type === "Status") {
                if (message === false) {
                    self._videoView.setStatus(`The device: ${self._devices[strDev]} is not streaming`, self._tags.iTag[strDev]);

                } else if (message === true) {
                    self._videoView.setStatus(`The device: ${self._devices[strDev]} is streaming`, self._tags.iTag[strDev]);

                    if (self._first[strDev] === true) {
                        self._videoView.setStatus(`The device: ${self._devices[strDev]} is streaming. Takes a few moments to show`, self._tags.iTag[strDev]);

                        connect(strDev);
                        //self._websocket.sendRtc({data: {type: "SDPrequest", message: null, Device: strDev}});
                        self._first[strDev] = false;
                    }
                } else if (message === "off") {
                    self._videoView.setStatus(`The Device: ${self._devices[strDev]} is off`, self._tags.iTag[strDev]);
                }

                // Creates peers based on nuber of devices (sent from backend)
            } else if (Type === "Devices") {
                self._devices = message;
                self._tags.vTag = {};
                self._tags.iTag = {};

                for (const property in self._devices) {
                    self._tags.vTag[property] = self._videoView.getFreeTag(".video");
                    self._tags.iTag[property] = self._videoView.getFreeTag(".info");
                    self._first[property] = true;
                }
                // Submits backend SDP
            } else if (Type === "SDP") {
                console.log(message);
                let msg = JSON.parse(message)
                if ((self._regDone[strDev] === false)) {
                    console.log("Reneg");
                    if (msg.type === "answer") {
                        self._ans[strDev] = msg;  
                    } else if(msg.renegotiate === undefined){
                        self._peers[strDev].signal(msg);
                        console.log({ data: { type: "SDP", message: self._sdp[strDev], Device: strDev } });
                        self._peers[strDev].signal(self._ans[strDev]);
                        self._regDone[strDev] = true;
                    }
                } else if((self._regDone[strDev] === true)&&(msg.type === "answer")){
                    self._peers[strDev].signal(msg);
                }

            } else if (Type === "message") {
                self._videoView.setStatus("No stream devices given", self._tags.iTag[strDev]);
            }

        });
        function connect(device){
        self._peers[device] = new SimplePeer({
            initiator: true,
            trickle: false
        });
        self._peers[device].on('error', err => console.log('error', err));
        self._peers[device].on('signal', data => {
            self._sdp[device] = data;
            self._websocket.sendRtc({ data: { type: "SDP", message: self._sdp[device], Device: device } });
        });
        self._peers[device].on('stream', stream => {
            self._streams[device] = stream;
            self._videoView.setStream(self._streams[device], self._tags.vTag[device]);
        });

        self._regDone[device] = false;

    }

        window.onclose = function () {
            self._peers.destroy();
            self._streams = {};
        }

    }
} 