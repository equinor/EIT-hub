class ShuttleControl {
    constructor(azureIot, browserWs, deviceWs, auth) {
        this.azureIot = azureIot;
        this.browserWs = browserWs;
        this.deviceWs = deviceWs;
        this.auth = auth;
        this.currentBrowser = null;
        this.currentUser = null;
    }

    start() {
        let self = this;

        self.azureIot.onMessage('shuttle', function (message) {
            let messageType = message.systemProperties.messageId;
            if (messageType === 'requestToken') {
                let token = self.auth.getDeviceToken('shuttle');
                self.azureIot.sendMessage('shuttle',token);
            }
        });
        
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

            let wantsControl = message.body;
            let browserId = message.browserId;
            let userName = message.user.name;
            let inputControlFeedback = new Object();
            inputControlFeedback.type = 'inputControl';

            if (wantsControl && self.currentBrowser === null) {
                self.currentBrowser = browserId;
                self.currentUser = userName;
                inputControlFeedback.body = userName;
                self.browserWs.broadcast(inputControlFeedback);
            } else if (!wantsControl && browserId === self.currentBrowser) {
                self.currentBrowser = null;
                self.currentUser = null;
                inputControlFeedback.body = null;
                self.browserWs.broadcast(inputControlFeedback);
            }
        });

        // Listens for all websocket messages with type 'changeFlightMode'
        self.browserWs.onTopic('changeFlightMode', function (message) {

            let browserId = message.browserId;
            if (browserId === self.currentBrowser) {
                let flightMode = message.body;
                // These are the only flight modes we use
                if (['MANUAL', 'STABILIZE', 'ALT_HOLD'].indexOf(flightMode) > -1) {
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
                let armShuttle = message.body;
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
                self.currentUser = null;
            }
        });

        self.browserWs.onOpen(function (browserId, user) {
            let inputControlFeedback = new Object();
            inputControlFeedback.type = 'inputControl';
            inputControlFeedback.body = self.currentUser;
            self.browserWs.sendMessage(browserId, inputControlFeedback);
        });
    }
}

module.exports = ShuttleControl;