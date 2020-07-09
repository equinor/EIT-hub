/* istanbul ignore file */

const express = require('express');

class Express {
    constructor(port, auth) {
        this.port = port;
        this.app = express();

        this.app.use(express.static('public'));
    }

    start() {
        this.app.listen(this.port, () => console.log(`EIT Hub is listening at http://localhost:${this.port}`));
    }
}



module.exports = Express;
