import WebSocket from 'ws';

export type BrowserMessage = {
    browserId: number,
    type: string,
    user: any,
    body: any,
}

export type MessageCallback = (msg: BrowserMessage)=>void;
export type StatusCallback = (browserId:number, user: any)=>void;

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
export default class BrowserWs {
    private ws: WebSocket.Server = new WebSocket.Server({noServer: true});
    private wsMap: Map<number, WebSocket> = new Map();
    private clientCount: number = 0;
    private _onOpenCallbacks: StatusCallback[] = [];
    private _onCloseCallbacks: StatusCallback[] = [];
    private _onBrowserCallbacks: Map<number, MessageCallback[]> = new Map();
    private _onTopicCallbacks: Map<string, MessageCallback[]> = new Map();
    
    constructor() {
    }

    /** Try to send a message to a browser. If the device is not connected the message will be dropped.
     * 
     * @param {number} browserId
     * @param {any} jsonObject
     * @returns {boolean} If there was a browser to send message too.
     */
    sendMessage(browserId: number, jsonObject: any): boolean{
        
        try {
            this.wsMap.get(browserId)!.send(JSON.stringify(jsonObject));
            return true;
        } catch(err) {
            console.log(err)
            return false;
        }
    }

    broadcast(jsonObject:any) {
        let msg = JSON.stringify(jsonObject);
        this.ws.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(msg);
            }
          });
    }

    /** Register a callback new browser connections.
     * 
     * @param {BrowserCallback} callback is called with the browserId and user object as parameters.
     */
    onOpen(callback:StatusCallback) {

        this._onOpenCallbacks.push(callback);
    }


    /** Register a callback for all future messages from this browser.
     * 
     * @param {number} browserId
     * @param {Function} callback The callback return a js object with the parsed json data from device.
     */
    onBrowser(browserId:number, callback:MessageCallback) {
        
        if (this._onBrowserCallbacks.has(browserId)){
            this._onBrowserCallbacks.get(browserId)!.push(callback);
        } else {
            let emptyArr = [callback];
            this._onBrowserCallbacks.set(browserId,emptyArr);
        }

    }

    /** Register a callback for all future messages on a topic.
     * 
     * @param {string} topic
     * @param {Function} callback is called with all the messages from all the browsers on a topic.
     */
    onTopic(topic: string, callback: MessageCallback) {

        if (this._onTopicCallbacks.has(topic)){
            this._onTopicCallbacks.get(topic)!.push(callback);
        } else {
            let emptyArr = [callback];
            this._onTopicCallbacks.set(topic,emptyArr);
        }
    }

    /** Gets the current ready state for the device in question. 3 (CLOSED) if no connections exist
     * 
     * @param {number} browserId
     * @return {number} WebSocket ready state.
     */
    getState(browserId: number): number {

        if (this.wsMap.has(browserId)){
            return this.wsMap.get(browserId)!.readyState;
        } else {
            return 3;
        }
    }

    /** Calls callback when a browser have disconnected.
     * 
     * @param {Function} callback called with the browserId and user object as properties.
     */
    onClosed(callback: StatusCallback) {

        this._onCloseCallbacks.push(callback);
    }

    /**
     * @param {any} user user object from authentication.
     * @param {import("http").IncomingMessage} request
     * @param {import("net").Socket} socket
     * @param {Buffer} head
     */
    handleUpgrade(user:any, request: import("http").IncomingMessage, socket: import("net").Socket, head: Buffer) {

        let self = this;
        this.ws.handleUpgrade(request, socket, head, function(websocket) {

            let browserId = self.clientCount;
            self.clientCount += 1;
            self.wsMap.set(browserId, websocket);

            // onOpen
            if (self._onOpenCallbacks.length > 0) {
                for (let callback of self._onOpenCallbacks) {
                    callback(browserId,user)
                }
            }
            
            // onMessage
            websocket.on("message", (msg) => {

                let msgParse = JSON.parse(msg as any);
                const message = {
                    browserId: browserId,
                    type: msgParse.type,
                    user: user,
                    body: msgParse.body,
                }

                if (self._onBrowserCallbacks.has(message.browserId) && self._onBrowserCallbacks.get(message.browserId)!.length > 0) {
                    for (let callback of self._onBrowserCallbacks.get(message.browserId)!) {
                        callback(message)
                    }
                }
                
                if (self._onTopicCallbacks.has(message.type) && self._onTopicCallbacks.get(message.type)!.length > 0) {
                    for (let callback of self._onTopicCallbacks.get(message.type)!) {
                        callback(message)
                    }
                }
            })

            // onClose
            websocket.on("close", () => {

                console.log(`${user.name} closed browser ${browserId}.`);
                self.wsMap.delete(browserId);
                if (self._onCloseCallbacks.length > 0) {
                    for (let callback of self._onCloseCallbacks) {
                        callback(browserId,user)
                    }
                }
            }) 
     
        })
    }
}
