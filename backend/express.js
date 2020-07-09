/* istanbul ignore file */

const express = require('express');

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
        //TODO a lot of socket setup code.
    }
}



module.exports = Express;
