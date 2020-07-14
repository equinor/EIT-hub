/* istanbul ignore file */
"use strict";
const dotenv = require('dotenv');

const Auth = require('./auth');
const AzureIot = require('./azureiot');
const BrowserWs = require('./browser-ws');
const Config = require('./config');
const DeviceWS = require('./device-ws');
const Express = require('./express');
const ShuttleControl = require('./shuttle-control');
const ShuttleTelemetry = require('./shuttle-telemetry');

/** The main function for Eit-Hub backend.
 *  We should not have js code directly in the file.
 */
function main() {
    //run dotenv to populate possess.env from .env file if exists.
    dotenv.config();

    //Get configuration
    const config = new Config();
    config.applyEnv(process.env);

    //Setup Auth
    const auth = new Auth(config);

    //Setup Browser Websocket
    const browserWs = new BrowserWs();

    //Setup Device Websocket
    const deviceWs = new DeviceWS();

    //Setup Azure IoT
    const azureIot = new AzureIot(config);

    //Setup ShuttleControl
    const shuttleControl = new ShuttleControl(azureIot, browserWs, deviceWs);

    //Setup ShuttleTelemetry
    const shuttleTelemetry = new ShuttleTelemetry(azureIot, browserWs, deviceWs);

    //Create express
    const express = new Express(config.port, auth, browserWs, deviceWs)

    // Start EitHub
    shuttleControl.start();
    shuttleTelemetry.start();
    express.start();

}

// Invoke main and starts the server
main();
