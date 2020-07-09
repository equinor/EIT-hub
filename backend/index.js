/* istanbul ignore file */
"use strict";

const Auth = require('./auth');
const config = require('./config');
const Express = require('./express');

/** The main function for Eit-Hub backend.
 *  We should not have js code directly in the file.
 */
function main() {
    //Get configuration
    const configObj = config.main();

    //Setup Auth
    const auth = new Auth(configObj);

    //Create express
    const express = new Express(configObj.port, auth)

    // Starts server
    express.start();
}

// Invoke main and starts the server
main();
