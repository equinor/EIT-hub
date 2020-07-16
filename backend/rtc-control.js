/**
 * Managers many VideoStreams. And link it up with azure iot and connection with browser.
 */

class RtcControl {
    constructor(azureIot, browserWS, VideoStream, config) {
        this.azureIot = azureIot;
        this.browserWS = browserWS;
        this.VideoStream = VideoStream;
        this.Devices = JSON.parse(config.iotHubStreamDevices)
    }

    start() {
        let self = this;

        let Device = {
            Devices: {},
            Status: {},
            Peers: {},
            sdpIn: {},
            sdpOut: {},
            Streams: {}
        };

        let Client = {
            Count: 0,
            Peers: {},
            sdpIn: {},
            sdpOut: {}
        };

        Device.Devices = self.Devices;

        // Checking if the stream status is updating (every 20 sec) 
        function timeout() {
            for (const property in Device.Devices) {
                if (Device.Status[property] == null) {
                    console.log(`${property} is off`);
                }
                Device.Status[property] = null;
            }
            setTimeout(timeout, 20000);
        }
        setTimeout(timeout, 20000);

        // Azure IoT message listeners with apropriate responses
        for (const property in Devices.Devices) {
            self.azureIot.onMessage(Device.Devices[property], function (message) {

                if (message.type == "SDP") {

                    Device.sdpIn[property] = message.message;

                    self.VideoStream.createDevicePeer(Device.sdpIn[property], function (DataObj) {

                        Device.sdpOut[property] = DataObj.sdp;
                        Device.Peers[property] = DataObj.peer;
                        Device.Streams[property] = DataObj.stream;

                        self.azureIot.sendMessage(Device.Devices[property], { command: "submitSDP", commandData: Device.sdpOut[property] });
                    });

                } else if (message.type == "message") {

                    console.log(message.message);

                } else if (message.type == "Status") {

                    Device.Status[property] = message.message;
                    message.Device = Device.Devices[property];
                    msg = { type: "rtc", data: message };
                    self.browserWS.brodcast(msg);

                }
            });
        }

        // Adds browser variables to Client object and starts device streams if it is the only browser connected 
        self.browserWS.onOpen(function (browserId) {

            if (count == 0) {
                for (const property in Device.Devices) {
                    self.azureIot.sendMessage(Device.Devices[property], { command: "getSDP", commandData: null });
                }
            }

            Client.Count += 1;
            Client.Peers[browserId] = {};
            Client.sdpOut[browserId] = {};
            Client.sdpIn[browserId] = {};

        });

        // Destroying apropriate peer and deletes browser info when a browser disconnects, 
        self.browserWS.onClosed(function (browserId) {

            Client.Count -= 1;

            for (const property in Device.Devices) {
                self.VideoStream.PeerDestroy(Client.Peers[browserId][property], browserId);
                delete Client.Peers[browserId];
                delete Client.sdpOut[browserId];
                delete Client.sdpIn[browserId];
            }

            // Checks if there is no browser connected and stops device streams if there is none
            if (Client.Count == 0) {
                for (const property in Device.Devices) {
                    self.azureIot.sendMessage(Device.Devices[property], { command: "Close", commandData: null });
                    self.VideoStream.PeerDestroy(Device.Peers[property], property);
                }
            }

        });

        // Browser message listener with apropriate responses
        self.browserWS.onTopic("rtc", function (message) {

            let browserId = message.browserId;

            // When asked the server will provide server SDP to the client(and stream device)
            if (message.body.data.type == "SDPrequest") {
                for (const property in Device.Devices) {
                    self.VideoStream.createClientPeer(Device.Streams[property], function (DataObj) {

                        Client.Peers[browserId][property] = DataObj.peer;
                        Client.sdpOut[browserId][property] = DataObj.sdp;

                        self.browserWS.sendMessage(browserId, { type: "rtc", data: { type: "SDP", message: Client.sdpOut[browserId][property], Device: property }});

                    });
                }
            // Submits client SDP. When this is done the video stream will show in browser 
            } else if (message.body.data.type == "SDP") {

                let StreamDevice = message.body.data.Device;
                Client.sdpIn[browserId][StreamDevice] = message.body.data.message;

                self.VideoStream.submitClientSDP(Client.Peers[browserId][StreamDevice], Client.sdpIn[browserId][StreamDevice]); 
            } 

        });

    }
}

module.exports = RtcControl;