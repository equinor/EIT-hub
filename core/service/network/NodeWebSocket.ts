import IWebSocket from "../../common/network/IWebSocket";
import WebSocket from "ws"

/* istanbul ignore next */
export default class NodeWebSocket  implements IWebSocket {

    constructor(private _ws: WebSocket) {

    }

    onMessage(callback: (data: string) => void): void {
        this._ws.onmessage = function(event: WebSocket.MessageEvent) {
            callback(event.data as string);
        }
    }

    onConnectionChange(callback: (connected: boolean) => void): void {
        this._ws.onopen = () => callback(true);
        this._ws.onclose = () => callback(false);
    }

    get isConnected(): boolean {
        return this._ws.readyState === WebSocket.OPEN;
    }

    send(data: string): void {
        this._ws.send(data);
    }

    close(code = 1005, reason = ""): void {
        this._ws.close(code, reason);
    }
}