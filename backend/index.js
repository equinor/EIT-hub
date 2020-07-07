"use strict";

const express = require('express');

const config = require('./config');

/** The main function for Eit-Hub backend.
 *  We should not have js code directly in the file.
 */
function main() {
    //Get configuration
    const configObj = config.main();

    const app = express();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.listen(configObj.port, () => console.log(`Example app listening at http://localhost:${configObj.port}`));
}

// Invoke main and starts the server
main();