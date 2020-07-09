/* istanbul ignore file */
"use strict";

const Auth = require('./auth');
const BrowserWs = require('./browser-ws');
const config = require('./config');
const DeviceWS = require('./device-ws');
const Express = require('./express');

/** The main function for Eit-Hub backend.
 *  We should not have js code directly in the file.
 */
function main() {
    //Get configuration
    const configObj = config.main();

    //Setup Auth
    const auth = new Auth(configObj);

    //Setup Browser Websocket
    const browserWs = new BrowserWs();

    //Setup Device Websocket
    const deviceWs = new DeviceWS();

    //Create express
    const express = new Express(configObj.port, auth, browserWs, deviceWs)

    // Starts server
    express.start();
}

// Invoke main and starts the server
main();
