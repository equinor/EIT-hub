class ShuttleTelemetry {
    constructor(azureIot, browserWs, deviceWs) {
        this.azureIot = azureIot;
        this.browserWs = browserWs;
        this.deviceWs = deviceWs;
    }

    start(){
        let self = this;

        // Receive and forward real time telemetry from shuttle
        self.deviceWs.onMessage('shuttle', function(message)  {
                self.browserWs.broadcast(message);
        });

        // Receive and forward aggregated telemetry from shuttle
        self.azureIot.onMessage('shuttle', function(message)  {
            // TODO
        });
    }
}

module.exports = ShuttleTelemetry;