class ShuttleControl {
    constructor(azureIot, browserWs, deviceWs) {
        this.azureIot = azureIot;
        this.browserWs = browserWs;
        this.deviceWs = deviceWs;
        this.currentBrowser = 0;
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

            let inputControlFeedback = new Object();
            inputControlFeedback.type = 'inputControl';
            inputControlFeedback.body = false;
            console.log(inputControlFeedback);
            // Update client view
            self.browserWs.sendMessage(self.currentBrowser, inputControlFeedback)
            
            // Give new websocket control
            let browserId = message.browserId;
            self.currentBrowser = browserId;
            inputControlFeedback.body = true;
            console.log(inputControlFeedback);
            // Update client view
            self.browserWs.sendMessage(self.currentBrowser, inputControlFeedback)

            console.log("This browser is now in control of the shuttle"); 
        });
    }
}

module.exports = ShuttleControl;