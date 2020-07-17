
/** A wrapper and simplification over Azure IoT for EitHubs needs.
 * Assumes that all messages are json.
 * 
 * This is the only part of the code that can use Azure IoT apis. Add method as needed.
 */

const Client = require('azure-iothub').Client;
const Message = require('azure-iot-common').Message;
const { EventHubConsumerClient } = require("@azure/event-hubs");

class AzureIot {
    constructor(config) {
        this._onMessageCallbacks = new Map();
        this.iotHubClient = Client.fromConnectionString(config.iotHubConnectionString);
        this.eventHubConsumer = new EventHubConsumerClient("$Default", config.eventHubConnectionString);
    }

    /** Try to send a message to a device. If the device do not exist then it will be dropped.
     * 
     * @param {string} deviceName
     * @param {any} jsonObject
     * @returns {boolean} If there was nowhere to send to.
     */
    sendMessage(deviceName, jsonObject) {
        var message = new Message(JSON.stringify(jsonObject));
        message.messageId = 'c2d';
        console.log(`Sending message to ${deviceName} with payload:\n`, message.getData())
        this.client.send(deviceName, message, function(err) {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    }

    /** Register a callback for used with device.
     * 
     * @param {string} deviceName
     * @param {Function} callback called with a js object with the message from device as argument.
     */
    onMessage(deviceName, callback) {
        if (this._onMessageCallbacks.has(deviceName)){
            this._onMessageCallbacks.get(deviceName).push(callback);
        } else {
            let emptyArr = [callback];
            this._onMessageCallbacks.set(deviceName,emptyArr);
        }
    }

    async start() {
        let self = this;

        let _processMessage = function(messages) {
            for (const message of messages) {
                let deviceName = message.systemProperties['iothub-connection-device-id'];

                if (self._onMessageCallbacks.has(deviceName) && self._onMessageCallbacks.get(deviceName).length > 0) {
                    for (let callback of self._onMessageCallbacks.get(deviceName)) {
                        callback(message);
                    }
                }
            }
        };

        let _processError = function(err) {
            console.log(err);
        };
      
        // Subscribe to messages from all partitions as below
        self.eventHubConsumer.subscribe({
          processEvents: _processMessage,
          processError: _processError
        });
      }
}

module.exports = AzureIot;