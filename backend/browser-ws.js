const WebSocket  = require('ws');

/** Class that deals with the low level websocket connections from browsers.
 *
 * This is the only class and children can use ws module when it comes to browsers.
 * 
 * This class will assume that all messages from the browser is json and that every message have a type property
 * All messages form BrowserWs have the following properties. 
 * 
 * browserId: an number to uniquely identify a browser.
 * type: the type from the message.
 * user: A structure for what user this message was from.
 * body: The message as sent from the browser as an JS object.
 */
class BrowserWs {
    constructor() {
        this.ws = new WebSocket.Server({noServer: true});
    }

    /** Try to send a message to a browser. If the device is not connected the message will be dropped.
     * 
     * @param {number} browserId
     * @param {any} jsonObject
     * @returns {boolean} If there was a browser to send message too.
     */
    sendMessage(browserId, jsonObject){
        //TODO needs to handle a connection at some point.

        console.log(`Trying to send message to ${browserId} but its not implemented. Payload:\n`, jsonObject);
        
        return false;
    }

    /** Register a callback new browser connections.
     * 
     * @param {Function} callback is called with the browserId and user object as parameters.
     */
    onOpen(callback) {
        //TODO
    }

    /** Register a callback for all future messages from this browser.
     * 
     * @param {number} browserId
     * @param {Function} callback The callback return a js object with the parsed json data from device.
     */
    onBrowser(browserId, callback) {
        //TODO
    }

    /** Register a callback for all future messages on a topic.
     * 
     * @param {string} topic
     * @param {Function} callback is called with all the messages from all the browsers on a topic.
     */
    onTopic(topic, callback) {
        //TODO
    }

    /** Gets the current ready state for the device in question. 3 (CLOSED) if no connections exist
     * 
     * @param {number} browserId
     * @return {number} WebSocket ready state.
     */
    getState(browserId) {
        return 3
    }

    /** Calls callback when a browser have disconnected.
     * 
     * @param {Function} callback called with the browserId and user object as properties.
     */
    onClosed(callback) {
        //TODO
    }

    /**
     * @param {any} user user object from authentication.
     * @param {import("http").IncomingMessage} request
     * @param {import("net").Socket} socket
     * @param {Buffer} head
     */
    handleUpgrade(user, request, socket, head) {
        this.ws.handleUpgrade(request, socket, head, function(websocket) {
            //TODO handle websocket
        })
    }
}

module.exports = BrowserWs;