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

        this.app.use(express.static('public'));
    }

    start() {
       let nodeServer = this.app.listen(this.port, () => console.log(`EIT Hub is listening at http://localhost:${this.port}`));
       nodeServer.on('upgrade', this._upgrade.bind(this));
    }

    _upgrade(request, socket, head){
        const pathname = url.parse(request.url).pathname;
        const path = pathname.split("/");

        if (path[1] === 'browser') {
            this.browserWs.handleUpgrade({}, request, socket, head);
        } else if (path[1] === 'device') {
            this.deviceWs.handleUpgrade(path[2], request, socket, head);
        } else {
            socket.destroy();
        }
    }
}

module.exports = Express;