
/** A wrapper and simplification over Azure IoT for EitHubs needs.
 * Assumes that all messages are json.
 * 
 * This is the only part of the code that can use Azure IoT apis. Add method as needed.
 */
class AzureIot {
    constructor(config) {

    }

    /** Try to send a message to a device. If the device do not exist then it will be dropped.
     * 
     * @param {string} deviceName
     * @param {any} jsonObject
     * @returns {boolean} If there was nowhere to send to.
     */
    sendMessage(deviceName, jsonObject) {
        //TODO needs to handle a connection at some point.

        console.log(`Trying to send message to ${deviceName} but its not implemented. Payload:\n`, jsonObject);
        
        return false;
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