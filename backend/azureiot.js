
/** A wrapper and simplification over Azure IoT for EitHubs needs.
 * Assumes that all messages are json.
 * 
 * This is the only part of the code that can use Azure IoT apis. Add method as needed.
 */

const Client = require('azure-iothub').Client;
const Message = require('azure-iot-common').Message;
const config = require('./config');

class AzureIot {
    constructor(config) {
        this.configObj = config.main();
        this.connectionString = configObj.IOTHUB_CONNECTION_STRING;
        this.client = Client.fromConnectionString(this.connectionString);
    }

    /** Try to send a message to a device. If the device do not exist then it will be dropped.
     * 
     * @param {string} deviceName
     * @param {any} jsonObject
     * @returns {boolean} If there was nowhere to send to.
     */
    sendMessage(deviceName, jsonObject) {
        var message = new Message(jsonObject);
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
        //TODO
    }
}

module.exports = AzureIot;