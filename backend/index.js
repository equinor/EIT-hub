/* istanbul ignore file */
"use strict";

const config = require('./config');
const express = require('./express');

/** The main function for Eit-Hub backend.
 *  We should not have js code directly in the file.
 */
function main() {
    //Get configuration
    const configObj = config.main();

    // Start webserver
    express.start(configObj.port);
}

// Invoke main and starts the server
main();