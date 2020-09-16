import WebSocket from 'ws';
import NodeWebSocket from './network/NodeWebSocket';
import IWebSocket from '../common/network/IWebSocket';

export type BrowserMessage = {
    browserId: number,
    type: string,
    user: any,
    body: any,
}

export type MessageCallback = (msg: BrowserMessage)=>void;
export type StatusCallback = (browserId:number, user: any)=>void;

/* istanbul ignore file */
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
    private wsMap: Map<number, IWebSocket> = new Map<number,IWebSocket>();
    private clientCount = 0;
    private _onOpenCallbacks: StatusCallback[] = [];
    private _onCloseCallbacks: StatusCallback[] = [];
    private _onBrowserCallbacks: Map<number, MessageCallback[]> = new Map<number, MessageCallback[]>();
    private _onTopicCallbacks: Map<string, MessageCallback[]> = new Map<string, MessageCallback[]>();
    
    /** Try to send a message to a browser. If the device is not connected the message will be dropped.
     * 
     * @param {number} browserId
     * @param {any} jsonObject
     * @returns {boolean} If there was a browser to send message too.
     */
    public sendMessage(browserId: number, jsonObject: never): boolean{
        
        try {
            this.wsMap.get(browserId)!.send(JSON.stringify(jsonObject));
            return true;
        } catch(err) {
            console.log(err)
            return false;
        }
    }

    public broadcast(jsonObject:never):void {
        const msg = JSON.stringify(jsonObject);
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
    public onOpen(callback:StatusCallback): void {

        this._onOpenCallbacks.push(callback);
    }


    /** Register a callback for all future messages from this browser.
     * 
     * @param {number} browserId
     * @param {Function} callback The callback return a js object with the parsed json data from device.
     */
    public onBrowser(browserId:number, callback:MessageCallback):void {
        
        if (this._onBrowserCallbacks.has(browserId)){
            this._onBrowserCallbacks.get(browserId)!.push(callback);
        } else {
            this._onBrowserCallbacks.set(browserId,[callback]);
        }

    }

    /** Register a callback for all future messages on a topic.
     * 
     * @param {string} topic
     * @param {MessageCallback} callback is called with all the messages from all the browsers on a topic.
     */
    public onTopic(topic: string, callback: MessageCallback): void {

        if (this._onTopicCallbacks.has(topic)){
            this._onTopicCallbacks.get(topic)!.push(callback);
        } else {
            this._onTopicCallbacks.set(topic,[callback]);
        }
    }

    /** Calls callback when a browser have disconnected.
     * 
     * @param {Function} callback called with the browserId and user object as properties.
     */
    public onClosed(callback: StatusCallback): void {

        this._onCloseCallbacks.push(callback);
    }

    /**
     * @param {any} user user object from authentication.
     * @param {import("http").IncomingMessage} request
     * @param {import("net").Socket} socket
     * @param {Buffer} head
     */
    public handleUpgrade(user:any, request: import("http").IncomingMessage, socket: import("net").Socket, head: Buffer): void {
        this.ws.handleUpgrade(request, socket, head, (websocket) => {
            const ws = new NodeWebSocket(websocket);

            const browserId = this.clientCount;
            this.clientCount += 1;
            this.wsMap.set(browserId, ws);

            // onOpen
            if (this._onOpenCallbacks.length > 0) {
                for (const callback of this._onOpenCallbacks) {
                    callback(browserId,user)
                }
            }
            
            // onMessage
            ws.onMessage((msg) => {
                const msgParse = JSON.parse(msg);
                const message = {
                    browserId: browserId,
                    type: msgParse.type as string,
                    user: user,
                    body: msgParse.body as never,
                }

                for (const callback of this._onBrowserCallbacks.get(message.browserId) ?? []) {
                    callback(message)
                }

                for (const callback of this._onTopicCallbacks.get(message.type) ?? []) {
                    callback(message)
                }
            })

            // onClose
            ws.onConnectionChange(() => {

                console.log(`${user.name} closed browser ${browserId}.`);
                this.wsMap.delete(browserId);
                if (this._onCloseCallbacks.length > 0) {
                    for (const callback of this._onCloseCallbacks) {
                        callback(browserId,user)
                    }
                }
            }) 
        })
    }
}
