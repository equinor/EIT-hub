/* istanbul ignore file */
import express from 'express';
import cookieParser from 'cookie-parser';
import url from 'url';
import Auth from './auth';
import BrowserWs from './browser-ws';
import DeviceWs from './device-ws';
import {Server, IncomingMessage} from 'http'
import { Socket } from 'net';

export default class Express {
    private app: express.Express;
    server: Server | undefined;

    constructor(private port: number, private auth:Auth, private browserWs:BrowserWs, private deviceWs:DeviceWs) {
        this.app = express();
        this.server = undefined;

        this.app.use(cookieParser());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(this.auth.getBrowserMiddleware());
        this.app.use(express.static('./dist'));
    }

    public start():void {
        this.server = this.app.listen(this.port, () => console.log(`EIT Hub is listening at http://localhost:${this.port}`));
        this.server.on('upgrade', this._upgrade.bind(this));
    }

    public stop(): void {
        this.server?.close();
    }

    private _upgrade(request: IncomingMessage, socket: Socket, head: Buffer):void {
        const pathname = url.parse(request.url ?? "").pathname ?? "";
        const path = pathname.split("/");

        if (path[1] === 'browser') { 
            const user = this.auth.getUser(request);
            if(user !== null) {
                this.browserWs.handleUpgrade(user, request, socket, head);
            } else {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
            }
        } else if (path[1] === 'device') {
            if(this.auth.validateDeviceRequest(path[2], request)) {
                this.deviceWs.handleUpgrade(path[2], request, socket, head);
            }else{
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
            }
        } else {
            socket.destroy();
        }
    }
}