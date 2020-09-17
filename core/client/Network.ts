import Connection from "../common/network/Connection";
import IConnection from "../common/network/IConnection";
import IWebSocket from "../common/network/IWebSocket";

/* istanbul ignore file */
export default class Network {
    static connect(url: string): IConnection {
        const ws = BrowserWebSocket.connect(url);
        const c = new Connection();
        ws.onConnectionChange = (connected) => {
            if(connected){
                c.webSocket = ws
            }
        };
    
        return c;
    }
}

class BrowserWebSocket  implements IWebSocket {
    static connect(url: string): BrowserWebSocket {
        return new BrowserWebSocket(new window.WebSocket(url))
    }

    constructor(private _ws: WebSocket) {
        this._ws.onmessage = (event) => {
            if(this.onMessage !== undefined) {
                this.onMessage(event.data);
            }
        }

        this._ws.onopen = () => {
            if(this.onConnectionChange !== undefined) {
                this.onConnectionChange(true);
            }
        }

        this._ws.onclose = () => {
            if(this.onConnectionChange !== undefined) {
                this.onConnectionChange(false);
            }
        }
    }

    get isConnected(): boolean {
        return this._ws.readyState === WebSocket.OPEN;
    }
    onConnectionChange: ((connected: boolean) => void) | undefined;

    send(data: string): void {
        this._ws.send(data);
    }
    onMessage: ((data:string) => void) | undefined;

    close(code = 1005, reason = ""): void {
        this._ws.close(code, reason);
    }
}