/* istanbul ignore file */
"use strict";

const Auth = require('./auth');
const AzureIot = require('./azureiot');
const BrowserWs = require('./browser-ws');
const config = require('./config');
const DeviceWS = require('./device-ws');
const Express = require('./express');
const ShuttleControl = require('./shuttle-control');
const ShuttleTelemetry = require('./shuttle-telemetry');

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

    //Setup Azure IoT
    const azureIot = new AzureIot(configObj);

    //Setup ShuttleControl
    const shuttleControl = new ShuttleControl(azureIot, browserWs, deviceWs);

    //Setup ShuttleTelemetry
    const shuttleTelemetry = new ShuttleTelemetry(azureIot, browserWs, deviceWs);

    //Create express
    const express = new Express(configObj.port, auth, browserWs, deviceWs)

    // Start EitHub
    shuttleControl.start();
    shuttleTelemetry.start();
    express.start();

}

// Invoke main and starts the server
main();
