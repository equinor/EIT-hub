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

                let newObj = { x: input.x, y: input.y, z: input.z, r: input.r };
                if (Object.values(newObj).every(value => (value >= -1 && value <= 1))) {
                    self.deviceWs.sendMessage('shuttle', newObj);
                } else {
                    console.error('JSON object contains invalid data.');
                    return;
                }
            } else {
                return;
            }
        });

        self.browserWs.onTopic('inputControl', function (message) {

            let wantsControl = message.body.body;
            let browserId = message.browserId;
            let inputControlFeedback = new Object();
            inputControlFeedback.type = 'inputControl';

            // Client pressed request control:
            if (wantsControl) {
                // Nobody has control currently
                if (self.currentBrowser === null) {
                    self.currentBrowser = browserId;

                    inputControlFeedback.body = 'You have control';
                // Somebody is already in control
                } else {
                    if (browserId === self.currentBrowser) {
                        inputControlFeedback.body = 'You are already in control!'
                    } else {
                        inputControlFeedback.body = `Browser ${self.currentBrowser} is already in control!`;
                    }
                }
            // Client pressed give up control:
            } else {
                // Client was in control
                if (browserId === self.currentBrowser) {
                    self.currentBrowser = null;

                    inputControlFeedback.body = 'You are no longer in control';
                // Client was not in control
                } else {
                    inputControlFeedback.body = 'You are not in control'
                }
            }
            // Give feedback to client
            self.browserWs.sendMessage(browserId, inputControlFeedback);
        });

        self.browserWs.onClosed(function (browserId, user) {
            if (browserId === self.currentBrowser) {
                self.currentBrowser = null;
            }
        });
    }
}

module.exports = ShuttleControl;