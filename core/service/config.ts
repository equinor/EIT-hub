import { URL } from 'url';

export default class Config {
    constructor(
        public readonly port: number,
        public readonly baseUrl: URL,
        public readonly disableDeviceAuth: boolean,
        public readonly iotHubConnectionString: string,
        public readonly eventHubConnectionString: string,
        public readonly clientId: string,
        public readonly tenantId: string,
        public readonly clientSecret: string) {
            if(this.disableDeviceAuth && this.baseUrl.hostname !== "localhost") {
                console.warn("Tried to disable security in production. Ignored request");
                this.disableDeviceAuth = false;
            }
    }

    public static readonly default: Config = new Config(3000, new URL("http://localhost:3000/"), false, "","","","","")

    public set({ port = this.port, baseUrl = this.baseUrl, disableDeviceAuth = this.disableDeviceAuth,
        iotHubConnectionString = this.iotHubConnectionString, eventHubConnectionString = this.eventHubConnectionString,
        clientId = this.clientId, tenantId = this.tenantId, clientSecret = this.clientSecret}): Config {
        return new Config(port, baseUrl, disableDeviceAuth, iotHubConnectionString, eventHubConnectionString, clientId, tenantId, clientSecret);
    }

    public envSet(processEnv: { [key: string]: string | undefined; }): Config {
        const env:Record<string, unknown> = {};
        if (processEnv.EITHUB_PORT) {
            env.port = parseInt(processEnv.EITHUB_PORT);
        }
        if (processEnv.EITHUB_BASE_URL) {
            env.baseUrl = new URL(processEnv.EITHUB_BASE_URL);
        }
        if (processEnv.EITHUB_DISABLE_DEVICE_AUTH) {
            env.disableDeviceAuth = processEnv.EITHUB_DISABLE_DEVICE_AUTH === "true";
        }
        if (processEnv.EITHUB_IOTHUB_CONNECTION_STRING) {
            env.iotHubConnectionString = processEnv.EITHUB_IOTHUB_CONNECTION_STRING;
        }
        if (processEnv.EITHUB_EVENTHUB_CONNECTION_STRING) {
            env.eventHubConnectionString = processEnv.EITHUB_EVENTHUB_CONNECTION_STRING;
        }
        if (processEnv.EITHUB_TENANT_ID) {
            env.tenantId = processEnv.EITHUB_TENANT_ID;
        }
        if (processEnv.EITHUB_CLIENT_ID) {
            env.clientId = processEnv.EITHUB_CLIENT_ID;
        }
        if (processEnv.EITHUB_CLIENT_SECRET) {
            env.clientSecret = processEnv.EITHUB_CLIENT_SECRET;
        }

        return this.set(env);
    }
}
