import IWebSocket from "../../common/network/IWebSocket";

/* istanbul ignore next */
export default class BrowserWebSocket  implements IWebSocket {
    static connect(url: string): BrowserWebSocket {
        return new BrowserWebSocket(new window.WebSocket(url))
    }

    constructor(private _ws: WebSocket) {

    }

    onMessage(callback: (data: string) => void): void {
        this._ws.onmessage = function(event: MessageEvent) {
            callback(event.data);
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