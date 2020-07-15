const URL = require('url').URL;

class Config {
    constructor(){
        this._port = 3000;
        this._baseUrl = new URL("http://localhost:3000/");
        this._disableDeviceAuth = true;
        this._iotHubConnectionString = "";
    }

    applyEnv(processEnv) {
        if(processEnv.EITHUB_PORT) {
            this._port = parseInt(processEnv.EITHUB_PORT);
        }
        if(processEnv.EITHUB_BASE_URL) {
            this._baseUrl = new URL(processEnv.EITHUB_BASE_URL);
        }
        if(processEnv.EITHUB_DISABLE_DEVICE_AUTH){
            this._disableDeviceAuth = processEnv.EITHUB_DISABLE_DEVICE_AUTH === "true";
        }
        if(processEnv.EITHUB_IOTHUB_CONNECTION_STRING){
            this._iotHubConnectionString = processEnv.EITHUB_IOTHUB_CONNECTION_STRING;
        }
        if(processEnv.EITHUB_IOTHUB_STREAM_DEVICES){
            this._iotHubStreamDevices = processEnv.EITHUB_IOTHUB_STREAM_DEVICES;
        }
    }

    get port() {
        return this._port;
    }

    get baseUrl() {
        return this._baseUrl;
    }

    get disableDeviceAuth() {
        if(this._disableDeviceAuth === false) {
            return false
        }

        // We want to disable security.
        if(this._baseUrl.hostname === "localhost") {
            // We are in localhost its fine.
            return true;
        }

        // We are in production
        console.warn("Tried to disable security in production. Ignored request")
        return false;
    }

    get iotHubConnectionString() {
        return this._iotHubConnectionString;
    }
    get iotHubStreamDevices() {
        return this._iotHubStreamDevices;
    }
}

module.exports = Config;
