/* istanbul ignore file */
"use strict";
import dotenv from 'dotenv';

import Auth from './auth';
import AzureIot from './azureiot';
import BrowserWs from './browser-ws';
import Config from './config';
import DeviceWS from './device-ws';
import Express from './express';
const ShuttleControl = require('../../apps/shuttle/services/shuttle-control');
const ShuttleTelemetry = require('../../apps/shuttle/services/shuttle-telemetry');

/** The main function for Eit-Hub backend.
 *  We should not have js code directly in the file.
 */
function main() {
    //run dotenv to populate possess.env from .env file if exists.
    dotenv.config();

    //Get configuration
    const config = Config.default.envSet(process.env);

    //Setup Auth
    const auth = new Auth(config);

    //Setup Browser Websocket
    const browserWs = new BrowserWs();

    //Setup Device Websocket
    const deviceWs = new DeviceWS();

    //Setup Azure IoT
    const azureIot = new AzureIot(config);

    //Setup ShuttleControl
    const shuttleControl = new ShuttleControl(azureIot, browserWs, deviceWs, auth);

    //Setup ShuttleTelemetry
    const shuttleTelemetry = new ShuttleTelemetry(azureIot, browserWs, deviceWs);

    //Create express
    const express = new Express(config.port, auth, browserWs, deviceWs)

    // Start EitHub
    azureIot.start();
    shuttleControl.start();
    shuttleTelemetry.start();
    //rtcControl.start();
    express.start();

}

// Invoke main and starts the server
main();
