import WebSocket from 'ws';
import NodeWebSocket from './network/NodeWebSocket';
import IWebSocket from '../common/network/IWebSocket';

export type MessageCallback = (msg:any) => void

/** Class that deals with the low level handling of websocket to devices.
 *
 * This is the only class and children can use ws module when it comes to devices.
 */
/* istanbul ignore file */
export default class DeviceWs {
    private ws: WebSocket.Server = new WebSocket.Server({noServer: true});
    private deviceMap: Map<string, IWebSocket> = new Map<string, IWebSocket> ();
    private _deviceCallback: Map<string, MessageCallback[]> = new Map<string, MessageCallback[]>();

    constructor() {
        this.ws = new WebSocket.Server({noServer: true});
    }

    /** Try to send a message to a device. If the device is not connected the message will be dropped.
     * 
     * @param {string} deviceName
     * @param {any} jsonMessage
     * @returns {boolean} If there was a connection to send message too.
     */
    public sendMessage(deviceName: string, jsonMessage: any): boolean{
        try {
            this.deviceMap.get(deviceName)!.send(JSON.stringify(jsonMessage));
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
    public onMessage(deviceName: string, callback: MessageCallback): void {
        if (this._deviceCallback.has(deviceName)){
            this._deviceCallback.get(deviceName)!.push(callback);
        }else {
            this._deviceCallback.set(deviceName, [callback]);
        }
    }

    /**
     * @param {string} deviceName
     * @param {import("http").IncomingMessage} request
     * @param {import("net").Socket} socket
     * @param {Buffer} head
     */
    public handleUpgrade(deviceName: string, request: import("http").IncomingMessage, socket: import("net").Socket, head: Buffer): void {
        this.ws.handleUpgrade(request, socket, head, (websocket)  => {
            const ws = new NodeWebSocket(websocket);
            this.deviceMap.set(deviceName, ws);

            ws.onMessage = (msg) => {
                const message = JSON.parse(msg);
                for (const callback of this._deviceCallback.get(deviceName) ?? []) {
                    callback(message);
                }
            };

            ws.onConnectionChange = () => {
                console.log(`${deviceName} websocket closed`);
                this.deviceMap.delete(deviceName);
            };
        });
    }
}

module.exports = DeviceWs;
