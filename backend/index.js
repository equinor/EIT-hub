/* istanbul ignore file */
"use strict";
const dotenv = require('dotenv');

const Auth = require('./auth');
const AzureIot = require('./azureiot');
const BrowserWs = require('./browser-ws');
const Config = require('./config');
const DeviceWS = require('./device-ws');
const VideoStream = require('./video-stream')
const Express = require('./express');
const ShuttleControl = require('./shuttle-control');
const ShuttleTelemetry = require('./shuttle-telemetry');
const RtcControl = require('./rtc-control');

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

    //For peer control
    const videoStream = new VideoStream(); 

    //Setup Azure IoT
    const azureIot = new AzureIot(config);

    //Setup ShuttleControl
    //const shuttleControl = new ShuttleControl(azureIot, browserWs, deviceWs, auth);

    //Setup ShuttleTelemetry
    //const shuttleTelemetry = new ShuttleTelemetry(azureIot, browserWs, deviceWs);

    //Create RtcControl
    const rtcControl = new RtcControl(azureIot, browserWs, videoStream, config);

    //Create express
    const express = new Express(config.port, auth, browserWs, deviceWs)

    // Start EitHub
    azureIot.start();
    //shuttleControl.start();
    //shuttleTelemetry.start();
    rtcControl.start();
    express.start();

}

// Invoke main and starts the server
main();
