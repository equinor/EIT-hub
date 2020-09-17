import IConnection from '../common/network/IConnection';

export type MessageCallback = (msg:any) => void

/** Class that deals with the low level handling of websocket to devices.
 *
 * This is the only class and children can use ws module when it comes to devices.
 */
/* istanbul ignore file */
export default class DeviceWs {
    private deviceMap: Map<string, IConnection> = new Map<string, IConnection> ();
    private _deviceCallback: Map<string, MessageCallback[]> = new Map<string, MessageCallback[]>();

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

    public newConnection(deviceName: string, connection: IConnection): void {
        this.deviceMap.set(deviceName, connection);

        connection.onMessage = (msg) => {
            const message = JSON.parse(msg);
            for (const callback of this._deviceCallback.get(deviceName) ?? []) {
                callback(message);
            }
        };

        connection.onOnline = (online) => {
            if(online) return;
            console.log(`${deviceName} websocket closed`);
            this.deviceMap.delete(deviceName);
        };
    }
}

module.exports = DeviceWs;
