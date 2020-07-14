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

        this.wsMap = new Map();
        this.clientCount = 0;
        this._connectionCallbacks = [];
        this._onBrowserCallbacks = new Map();
        this._onTopicCallbacks = new Map();

    }

    /** Try to send a message to a browser. If the device is not connected the message will be dropped.
     * 
     * @param {number} browserId
     * @param {any} jsonObject
     * @returns {boolean} If there was a browser to send message too.
     */
    sendMessage(browserId, jsonObject){
        
        try {
            this.wsMap.get(browserId).send(jsonObject);
            return true;
        } catch(err) {
            console.log(err)
            return false;
        }
    }

    /** Register a callback new browser connections.
     * 
     * @param {Function} callback is called with the browserId and user object as parameters.
     */
    onOpen(callback) {
        //TODO
        this._connectionCallbacks.push(callback);
    }


    /** Register a callback for all future messages from this browser.
     * 
     * @param {number} browserId
     * @param {Function} callback The callback return a js object with the parsed json data from device.
     */
    onBrowser(browserId, callback) {
        //TODO
        if (this._onBrowserCallbacks.has(browserId)){
            this._onBrowserCallbacks.get(browserId).push(callback);
        } else {
            emptyArr = [];
            emptyArr.push(callback);
            this._onBrowserCallbacks.set(browserId,emptyArr);
        }

    }

    /** Register a callback for all future messages on a topic.
     * 
     * @param {string} topic
     * @param {Function} callback is called with all the messages from all the browsers on a topic.
     */
    onTopic(topic, callback) {
        //TODO

        if (this._onTopicCallbacks.has(topic)){
            this._onTopicCallbacks.get(topic).push(callback);
        } else {
            emptyArr = [];
            emptyArr.push(callback);
            this._onTopicCallbacks.set(topic,emptyArr);
        }
    }

    /** Gets the current ready state for the device in question. 3 (CLOSED) if no connections exist
     * 
     * @param {number} browserId
     * @return {number} WebSocket ready state.
     */
    getState(browserId) {

        return this.wsMap.get(browserId).readyState;
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
        let self = this;
        this.ws.handleUpgrade(request, socket, head, function(websocket) {
            //TODO handle websocket

            // Open
            let browserId = self.clientCount;
            self.clientCount += 1;
            self.wsMap.set(browserId, websocket);

            // Message
            websocket.on("message", (msg) => {
                //console.log(message);
                const message = {
                    browserId: browserId,
                    type: msg.type,
                    user: user,
                    body: msg,
                }
                let messageJSON = JSON.stringify(message);
 
                if (self._onBrowserCallbacks.has(message.browserId) || self._onBrowserCallbacks.has(message.browserId).length > 0) {
                    for (callback of self._onBrowserCallbacks.get(message.browserId)) {
                        callback(messageJSON)
                    }
                }

                if (self._onTopicCallbacks.has(message.type) || self._onTopicCallbacks.has(message.type).length > 0) {
                    for (callback of self._onTopicCallbacks.get(message.type)) {
                        callback(messageJSON)
                    }
                }

            })

            // Close
            websocket.on("close", () => {
                console.log("closed");
                self.wsMap.delete(browserId);
            }) 
     
        })
    }
}

module.exports = BrowserWs;