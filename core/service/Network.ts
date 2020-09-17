import Connection from "../common/network/Connection";
import IConnection from "../common/network/IConnection";
import IWebSocket from "../common/network/IWebSocket";
import WebSocket from 'ws';
import { IncomingMessage } from 'http'
import { Socket } from 'net';

/* istanbul ignore file */
export default class Network {
    private _ws: WebSocket.Server = new WebSocket.Server({noServer: true});

    upgrade(request: IncomingMessage, socket: Socket, head: Buffer): IConnection {
        const c = new Connection();
        this._ws.handleUpgrade(request, socket, head, (websocket) => {
            c.webSocket = new NodeWebSocket(websocket);
        });

        return c;
    }
}

class NodeWebSocket  implements IWebSocket {
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