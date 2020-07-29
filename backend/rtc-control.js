/**
 * Managers many VideoStreams. And link it up with azure iot and connection with browser.
 */

class RtcControl {
    constructor(azureIot, browserWS, videoStream, config) {
        this.azureIot = azureIot;
        this.browserWS = browserWS;
        this.videoStream = videoStream;
        this.config = config;
        this.Devices;

        this.Device = {
            Status: {},
            Status2: {},
            Peers: {},
            sdpIn: {},
            sdpOut: {},
            Streams: {}
        };

        this.Client = {
            Count: 0,
            Peers: {},
            sdpIn: {},
            sdpOut: {}
        };
    }

    start() {
        let self = this;

        // Checking if the stream status is updating (every 20 sec) 
        function timeout() {
            for (const property in self.Devices) {
                if (self.Device.Status2[property] === null) {
                    console.log(`${property} is off`);
                    self.browserWS.broadcast({ type: "rtc", data: { type: "Status", message: "off", Device: property } });
                }
                self.Device.Status2[property] = null;
            }
            setTimeout(timeout, 20000);
        }
        setTimeout(timeout, 20000);

        if (self.config.iotHubStreamDevices !== "") {
            self.Devices = JSON.parse(self.config.iotHubStreamDevices);
        } else {
            console.log("No stream devices given");
            self.browserWS.onOpen(function (browserId) {
                self.browserWS.sendMessage(browserId, { type: "rtc", data: { type: "message", message: "No stream devices given" } });
            });
        }

        // Azure IoT message listeners with apropriate responses
        for (const property in self.Devices) {
            self.azureIot.onMessage(self.Devices[property], function (msg) {


                let message = msg.body;

                if (message.type === "SDP") {

                    self.Device.sdpIn[property] = message.message;

                    self.videoStream.createDevicePeer(self.Device.sdpIn[property], function (DataObj) {

                        self.Device.sdpOut[property] = DataObj.sdp;
                        self.Device.Peers[property] = DataObj.peer;
                        self.Device.Streams[property] = DataObj.stream;

                        self.azureIot.sendMessage(self.Devices[property], { command: "submitSDP", commandData: self.Device.sdpOut[property] });
                    });

                } else if (message.type === "message") {

                    console.log(message.message);

                } else if (message.type === "Status") {

                    self.Device.Status[property] = message.message;
                    self.Device.Status2[property] = message.message; // For timeout purposes
                    message.Device = property;
                    msg = { type: "rtc", data: message };
                    self.browserWS.broadcast(msg);

                    if ((self.Client.Count >= 1) && (self.Device.Status[property] === false)) {
                        self.azureIot.sendMessage(self.Devices[property], { command: "getSDP", commandData: null });
                    }

                }
            });
        }


        // Adds browser variables to Client object and starts device streams if it is the only browser connected 
        self.browserWS.onOpen(function (browserId) {

            self.browserWS.sendMessage(browserId, { type: "rtc", data: { type: "Devices", message: self.Devices } });

            function open() {
                if (self.Client.Count === 0) {
                    for (const property in self.Devices) {
                        self.azureIot.sendMessage(self.Devices[property], { command: "getSDP", commandData: null });
                    }
                }

                for (const property in self.Devices) {
                    self.browserWS.sendMessage(browserId, { type: "rtc", data: { type: "Status", message: self.Device.Status[property], Device: property } });
                }

                self.Client.Count += 1;
                self.Client.Peers[browserId] = {};
                self.Client.sdpOut[browserId] = {};
                self.Client.sdpIn[browserId] = {};

            }
            // Preventing start and stop command being sent almost simultaneously when the only browser connected hits refresh. Longer loading time for setting up device stream, however solves a bigger problem 
            // Can be done better, but this was the easy quickfix
            setTimeout(open, 700);

        });

        // Destroying apropriate peer and deletes browser info when a browser disconnects, 
        self.browserWS.onClosed(function (browserId) {

            self.Client.Count -= 1;


            for (const property in self.Devices) {
                if (self.Client.Peers[browserId][property] !== undefined) {
                    self.videoStream.PeerDestroy(self.Client.Peers[browserId][property], browserId);
                }
            }

            delete self.Client.Peers[browserId];
            delete self.Client.sdpOut[browserId];
            delete self.Client.sdpIn[browserId];


            // Checks if there is no browser connected and stops device streams if there is none
            if (self.Client.Count === 0) {
                for (const property in self.Devices) {
                    if (self.Device.Status[property] === true) {
                        self.azureIot.sendMessage(self.Devices[property], { command: "Close", commandData: null });
                        self.videoStream.PeerDestroy(self.Device.Peers[property], property);
                        self.Device.Status[property] = false;
                    }
                }
            }

        });

        // Browser message listener with apropriate responses
        self.browserWS.onTopic("rtc", function (message) {

            let browserId = message.browserId;
            let reqDev = message.body.data.Device;

            // When asked the server will provide server SDP to the client(and stream device)
            // Submits client SDP. When this is done the video stream will show in browser 
            if (message.body.data.type === "SDP") {

                for (const property in self.Devices) {
                    self.Client.Peers[browserId][property] = self.videoStream.createClientPeer(self.Device.Streams[property], function (DataObj) {
    
                        //self.Client.Peers[browserId][property] = DataObj.peer;
                        self.Client.sdpOut[browserId][property] = DataObj.sdp;
    
                        console.log(DataObj.sdp);
                        self.browserWS.sendMessage(browserId, { type: "rtc", data: { type: "SDP", message: self.Client.sdpOut[browserId][property], Device: property } });
    
                    });
                }

                self.Client.sdpIn[browserId][reqDev] = message.body.data.message;

                self.videoStream.submitClientSDP(self.Client.Peers[browserId][reqDev], self.Client.sdpIn[browserId][reqDev]);
            }

        });

    }
}

module.exports = RtcControl;