const WebSocket  = require('ws');

/** Class that deals with the low level handling of websocket to devices.
 *
 * This is the only class and children can use ws module when it comes to devices.
 */
class DeviceWs {
    constructor() {
        this.ws = new WebSocket.Server({noServer: true});
        this.deviceMap = new Map();
        this._deviceCallback = new Map();
    }

    /** Try to send a message to a device. If the device is not connected the message will be dropped.
     * 
     * @param {string} deviceName
     * @param {any} jsonMessage
     * @returns {boolean} If there was a connection to send message too.
     */
    sendMessage(deviceName, jsonMessage){
        try {
            this.deviceMap.get(deviceName).send(JSON.stringify(jsonMessage));
            return true;
        } catch(err) {
            console.log(err);
            console.log(`Trying to send message to ${deviceName} but its not implemented. Payload:\n`, jsonMessage);
            return false;
        }
    }

    /** Register a callback for used with device. The callback will be reused when device connects / disconnects.
     * 
     * @param {string} deviceName
     * @param {Function} callback The callback return a js object with the parsed json data from device.
     */
    onMessage(deviceName, callback) {
        if (this._deviceCallback.has(deviceName)){
            this._deviceCallback.get(deviceName).push(callback);
        }else {
            let emptyArr = [callback];
            this._deviceCallback.set(deviceName, emptyArr);
        }
    }

    /** Gets the current ready state for the device in question. 3 (CLOSED) if no connections exist
     * 
     * @param {string} deviceName
     * @return {number} WebSocket ready state.
     */
    getState(deviceName) {
        if(this.deviceMap.has(deviceName)) {
            return this.deviceMap.get(deviceName).readyState;
        } else {
            return 3;
        }
    }

    /** Calls callback when connection have been open or closed for that device. 
     * @param {string} deviceName
     * @param {Function} callback
     */
    onStateChange(deviceName, callback) {
        //TODO
    }

    /**
     * @param {string} deviceName
     * @param {import("http").IncomingMessage} request
     * @param {import("net").Socket} socket
     * @param {Buffer} head
     */
    handleUpgrade(deviceName, request, socket, head) {
        let self = this;
        this.ws.handleUpgrade(request, socket, head, function(websocket) {
            self.deviceMap.set(deviceName, websocket);
            websocket.on("message", (msg) => {
                const message = JSON.parse(msg);
                if (self._deviceCallback.has(deviceName)) {
                    for (let callback of self._deviceCallback.get(deviceName)) {
                        callback(message);
                    }
                }
            });

            websocket.on("close", () => {
                console.log(`${deviceName} websocket closed`);
                self.deviceMap.delete(deviceName);
            });
        });
    }
}

module.exports = DeviceWs;
