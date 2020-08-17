import {URL} from 'url';

export default class Config {
    _port: number;
    _baseUrl: URL;
    _disableDeviceAuth: boolean;
    _iotHubConnectionString: string;
    _iotHubStreamDevices: string;
    _eventHubConnectionString: string;
    _clientId: string;
    _tenantId: string;
    _clientSecret: string;

    constructor(){
        this._port = 3000;
        this._baseUrl = new URL("http://localhost:3000/");
        this._disableDeviceAuth = false;
        this._iotHubConnectionString = "";
        this._iotHubStreamDevices = "";
        this._eventHubConnectionString = "";
        this._clientId = "";
        this._tenantId = "";
        this._clientSecret = "";
    }

    applyEnv(processEnv: { [key: string]: string|undefined; }) {
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
        if(processEnv.EITHUB_EVENTHUB_CONNECTION_STRING){
            this._eventHubConnectionString = processEnv.EITHUB_EVENTHUB_CONNECTION_STRING;
        }
        if(processEnv.EITHUB_TENANT_ID){
            this._tenantId = processEnv.EITHUB_TENANT_ID;
        }
        if(processEnv.EITHUB_CLIENT_ID){
            this._clientId = processEnv.EITHUB_CLIENT_ID;
        }
        if(processEnv.EITHUB_CLIENT_SECRET){
            this._clientSecret = processEnv.EITHUB_CLIENT_SECRET;
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

    get eventHubConnectionString() {
        return this._eventHubConnectionString;
    }

    get clientId() {
        return this._clientId;
    }

    get tenantId() {
        return this._tenantId;
    }

    get clientSecret() {
        return this._clientSecret;
    }
}
