/* istanbul ignore file */

const express = require('express');
const url = require('url');

class Express {
    constructor(port, auth, browserWs, deviceWs) {
        this.port = port;
        this.auth = auth;
        this.browserWs = browserWs;
        this.deviceWs = deviceWs;
        this.app = express();
        this.server = undefined;

        this.app.use(express.static('public'));
    }

    start() {
        this.server = this.app.listen(this.port, () => console.log(`EIT Hub is listening at http://localhost:${this.port}`));
        this.server.on('upgrade', this._upgrade.bind(this));
    }

    stop() {
        this.server.close();
    }

    _upgrade(request, socket, head){
        const pathname = url.parse(request.url).pathname;
        const path = pathname.split("/");

        if (path[1] === 'browser') { 
            this.browserWs.handleUpgrade({}, request, socket, head);
        } else if (path[1] === 'device') {
            let token = this.auth.getDeviceToken(path[2]);
            request.headers.authorization = token.authorization;
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

module.exports = Express;