import IConnection from "./IConnection";
import IWebSocket from "./IWebSocket";

export default class Connection implements IConnection {
    private _ws: IWebSocket | undefined

    private _online = false;

    constructor(webSocket? : IWebSocket) {
        this.webSocket = webSocket;
    }

    isOnline(): boolean {
        return this._online;
    }

    onOnline: ((online: boolean) => void) | undefined;

    send(msg: string): boolean {
        if(this._ws?.isConnected === true) {
            this._ws.send(msg);
            return true;
        }
        return false;
    }
    
    onMessage: ((data: string) => void) | undefined;

    get webSocket(): IWebSocket | undefined {
        return this._ws;
    }

    set webSocket(ws: IWebSocket | undefined) {
        if(this._ws !== undefined) {
            this._ws.onMessage = undefined;
            this._ws.onConnectionChange = undefined;
            this._ws = undefined;
        }
        this._ws = ws;

        if(ws?.isConnected === true){
            ws.onMessage = (msg:string) => {
                this.onMessage?.(msg); 
            }
            ws.onConnectionChange = (connected:boolean) => {
                if(!connected) {
                    this.webSocket = undefined;
                }
            }

            this._ws = ws;
        }

        if(this._online !== (this._ws !== undefined)) {
            this._online = this._ws !== undefined;
            this.onOnline?.(this._online);
        }
    }

}