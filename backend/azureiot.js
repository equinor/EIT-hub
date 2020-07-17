
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
        this.config = config;
        this._onMessageCallbacks = new Map();
        if (this.config.iotHubConnectionString !== "") {
            this.iotHubClient = Client.fromConnectionString(this.config.iotHubConnectionString);
        }
        if (this.config.eventHubConnectionString !== "") {
            this.eventHubConsumer = new EventHubConsumerClient("$Default", this.config.eventHubConnectionString);
        }
    }

    /** Try to send a message to a device. If the device do not exist then it will be dropped.
     * 
     * @param {string} deviceName
     * @param {any} jsonObject
     * @returns {boolean} If there was nowhere to send to.
     */
    sendMessage(deviceName, jsonObject) {
        let self = this;

        if (self.config.iotHubConnectionString !== "") {

            let message = new Message(JSON.stringify(jsonObject));
            message.messageId = 'c2d';
            console.log(`Sending message to ${deviceName} with payload:\n`, message.getData())
            this.client.send(deviceName, message, function (err) {
                if (err) {
                    return false;
                } else {
                    return true;
                }
            });
        } else {
            console.warn('You have not specified an IoT Hub connection string.')
        }
    }

    /** Register a callback for used with device.
     * 
     * @param {string} deviceName
     * @param {Function} callback called with a js object with the message from device as argument.
     */
    onMessage(deviceName, callback) {
        if (this._onMessageCallbacks.has(deviceName)) {
            this._onMessageCallbacks.get(deviceName).push(callback);
        } else {
            let emptyArr = [callback];
            this._onMessageCallbacks.set(deviceName, emptyArr);
        }
    }

    async start() {
        let self = this;

        if (self.config.eventHubConnectionString !== "") {

            let _processMessage = function (messages) {
                for (const message of messages) {
                    let deviceName = message.systemProperties['iothub-connection-device-id'];

                    if (self._onMessageCallbacks.has(deviceName) && self._onMessageCallbacks.get(deviceName).length > 0) {
                        for (let callback of self._onMessageCallbacks.get(deviceName)) {
                            callback(message);
                        }
                    }
                }
            };

            let _processError = function (err) {
                console.log(err);
            };

            // Subscribe to messages from all partitions as below
            self.eventHubConsumer.subscribe({
                processEvents: _processMessage,
                processError: _processError
            });
        } else {
            console.warn('You have not specified an Event Hubs connection string.')
        }
    }
}

module.exports = AzureIot;