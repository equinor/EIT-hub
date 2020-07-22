class ShuttleControl {
    constructor(azureIot, browserWs, deviceWs) {
        this.azureIot = azureIot;
        this.browserWs = browserWs;
        this.deviceWs = deviceWs;
        this.currentBrowser = null;
    }

    start() {
        let self = this;
        // Listens for all websocket messages with type 'input'
        self.browserWs.onTopic('input', function (message) {

            let browserId = message.browserId;
            if (browserId === self.currentBrowser) {

                let input = message.body;

                let newObj = { type: 'input', x: input.x, y: input.y, z: input.z, r: input.r };
                let { type, ...inputValues } = newObj;
                // Input values should be in [-1,1]
                if (Object.values(inputValues).every(value => (value >= -1 && value <= 1))) {
                    self.deviceWs.sendMessage('shuttle', newObj);
                } else {
                    console.error('JSON object contains invalid data.');
                    return;
                }
            }
        });

        // Listens for all websocket messages with type 'inputControl'
        self.browserWs.onTopic('inputControl', function (message) {

            let wantsControl = message.body.body;
            let browserId = message.browserId;
            let inputControlFeedback = new Object();
            inputControlFeedback.type = 'inputControl';

            if (wantsControl && self.currentBrowser === null) {
                self.currentBrowser = browserId;
                inputControlFeedback.body = browserId;
                self.browserWs.broadcast(inputControlFeedback);
            } else if (!wantsControl && browserId === self.currentBrowser) {
                self.currentBrowser = null;
                inputControlFeedback.body = null;
                self.browserWs.broadcast(inputControlFeedback);
            }
        });

        // Listens for all websocket messages with type 'changeFlightMode'
        self.browserWs.onTopic('changeFlightMode', function (message) {

            let browserId = message.browserId;
            if (browserId === self.currentBrowser) {
                let flightMode = message.body.flightMode;
                // These are the only flight modes we use
                if (['MANUAL', 'STABILIZE', 'DEPTH_HOLD'].indexOf(flightMode) > -1) {
                    let newObj = { type: 'changeFlightMode', flightMode: flightMode };
                    self.deviceWs.sendMessage('shuttle', newObj);
                } else {
                    console.error('JSON object contains invalid data.');
                    return;
                }
            }
        });

        // Listens for all websocket messages with type 'armShuttle'
        self.browserWs.onTopic('armShuttle', function (message) {

            let browserId = message.browserId;
            if (browserId === self.currentBrowser) {
                let armShuttle = message.body.armShuttle;
                if (typeof(armShuttle) === 'boolean') {
                    let newObj = { type: 'armShuttle', armShuttle: armShuttle };
                    self.deviceWs.sendMessage('shuttle', newObj);
                } else {
                    console.error('JSON object contains invalid data.');
                    return;
                }
            }
        });

        self.browserWs.onClosed(function (browserId, user) {
            if (browserId === self.currentBrowser) {
                let inputControlFeedback = new Object();
                inputControlFeedback.type = 'inputControl';
                inputControlFeedback.body = null;
                self.browserWs.broadcast(inputControlFeedback);
                self.currentBrowser = null;
            }
        });

        self.browserWs.onOpen(function (browserId, user) {
            let inputControlFeedback = new Object();
            inputControlFeedback.type = 'inputControl';
            inputControlFeedback.body = self.currentBrowser;
            self.browserWs.sendMessage(browserId, inputControlFeedback);
        });
    }
}

module.exports = ShuttleControl;