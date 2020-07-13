require("dotenv").config();

// To make everythig to work in order
const Emitter = require("events");

// Azure iot requirement
const Client = require("azure-iothub").Client;

// webRTC library
const Peer = require("simple-peer");
const wrtc = require("wrtc");

// Websocket server
const WebSocket = require("ws");
const port = 80;
const wss = new WebSocket.Server({ port });

const em = new Emitter();
const connectionString = process.env.CONNECTION_STRING;
var client = Client.fromConnectionString(connectionString);
var deviceId = process.env.DEVICE_ID;
var video = null;
var SDPout = null;
var SDPin = null;
var SDPinOld = null;
var SDPoutC = null;


// Event listeners
em.on('SDPinEv', function () {
    submitSDP(SDPin);
});
em.on('SDPgen', function () {
    sendMethod("submitSDP", SDPout);
});


// Makes new peer when getSDP is called
function newP() {
    DevicePeer = new Peer({
        trickle: false,
        wrtc: wrtc
    });

    DevicePeer.on('error', err => console.log('error', err));
    DevicePeer.on('stream', stream => { video = stream });
}

// Get SDP
function getSDP() {
    DevicePeer.on('signal', data => {
        //console.log(JSON.stringify(data));
        console.log("Generated SDP answer");
        SDPout = JSON.stringify(data);
        em.emit('SDPgen');
    });
}

// Submit SDP
function submitSDP() {
    if (SDPin != SDPinOld) {
        DevicePeer.signal(JSON.parse(SDPin));
        console.log("Submited SDP");
        SDPinOld = SDPin;
        getSDP();
    }
}


function sendMethod(name, payload) {
    // Set the direct method name, payload, and timeout values
    var methodParams = {
        methodName: name,
        payload: payload,
        responseTimeoutInSeconds: 30
    };

    // 
    client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
        if (err) {
            console.error("Failed to invoke method \"" + methodParams.methodName + "\": " + err.message);
        } else {
            console.log("Response from " + methodParams.methodName + " on " + deviceId + ":");
            //console.log(result);
            if (name == "getSDP") {
                SDPin = result.payload;
                em.emit('SDPinEv');
            } else if (name == "submitSDP") {
                console.log("Connected, stream started");
            } else if (name == "Close") {
                console.log("Disconnected, stream closed");
                video = null;
                SDPout = null;
                SDPin = null;
                DevicePeer.destroy();
            }
        }
    });
}

function f() {
    // Makes sure the function is called only on the first browser connection (NOTE: the use of several clients is unstable)
    if (SDPin == null) {
        sendMethod("getSDP", null);
        newP();
    }
}

// This handles the browser connection
wss.on('connection', ws => {

    // Too fast when realoading page, need to timeout  
    setTimeout(f, 1000);

    ws.on('message', data => {

        var msg = JSON.parse(data);
        console.log(msg.name);

        // Ping so the websocket connection won't be shut down without websocket noticing (some NAT stuff) 
        if (msg.name == "ping") {
            ws.send("pong");
        
        // Creates new client peer when asked for    
        } else if (msg.name == "Start") {
            ClientPeer = new Peer({
                initiator: true,
                stream: video,
                trickle: false,
                wrtc: wrtc
            });

            ClientPeer.on('error', err => console.log('error', err));

            ClientPeer.on('signal', data => {
                console.log("Generated client SDP");
                SDPoutC = JSON.stringify(data);
                ws.send(SDPoutC);
            });

        } else if (msg.name == "Close") {
            SDPoutC = null;
            ClientPeer.destroy();

        } else if (msg.name = "ClientSDP") {
            ClientPeer.signal(JSON.parse(msg.desc));
            console.log("Submited client SDP");
        }
    });

    ws.on('close', () => {
        // Makes sure it is the last client connection that shuts down the stream
        if (wss.clients.size < 1) {
            sendMethod("Close", null);
        }
    });
});


