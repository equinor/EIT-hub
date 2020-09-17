import IWebSocket from "../../common/network/IWebSocket";
import WebSocket from "ws"

/* istanbul ignore next */
export default class NodeWebSocket  implements IWebSocket {
    constructor(private _ws: WebSocket) {
        this._ws.onmessage = (event) => {
            if(this.onMessage !== undefined) {
                this.onMessage(event.data as string);
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