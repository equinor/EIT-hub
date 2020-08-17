import {URL} from 'url';
import Config from './config';



test('default port is 3000', () => {
    expect(Config.default.port).toEqual(3000);
})

test('port from env', () => {
    const config = Config.default.envSet({
        EITHUB_PORT: "1234"
    })
    expect(config.port).toBe(1234);
})

test('default baseUrl is http://localhost:3000/', () => {
    expect(Config.default.baseUrl).toStrictEqual(new URL("http://localhost:3000/"));
})

test('baseUrl from env', () => {
    const config = Config.default.envSet({
        EITHUB_BASE_URL: "http://example.com/"
    })
    expect(config.baseUrl).toStrictEqual(new URL("http://example.com/"));
})

test('default disableDeviceAuth is true', () => {
    expect(Config.default.disableDeviceAuth).toBe(false);
})

test('disableDeviceAuth from env', () => {
    const config = Config.default.envSet({
        EITHUB_DISABLE_DEVICE_AUTH: "false"
    })
    expect(config.disableDeviceAuth).toBe(false);
})

test('disableDeviceAuth in prod', () => {
    const originalWarn = console.warn;
    console.warn = jest.fn();

    const config = Config.default.envSet({
        EITHUB_DISABLE_DEVICE_AUTH: "true",
        EITHUB_BASE_URL: "http://example.com/"
    })
    expect(config.disableDeviceAuth).toBe(false);

    console.warn = originalWarn;
})

test('default iotHubConnectionString is ""', () => {
    expect(Config.default.iotHubConnectionString).toEqual("");
})

test('iotHubConnectionString from env', () => {
    const config = Config.default.envSet({
        EITHUB_IOTHUB_CONNECTION_STRING: "some string"
    })
    expect(config.iotHubConnectionString).toBe("some string");
})

test('default eventHubConnectionString  is ""', () => {
    expect(Config.default.eventHubConnectionString).toEqual("");
})

test('eventHubConnectionString from env', () => {
    const config = Config.default.envSet({
        EITHUB_EVENTHUB_CONNECTION_STRING: "some string"
    })
    expect(config.eventHubConnectionString).toBe("some string");
})

test('default tenantId is ""', () => {
    expect(Config.default.tenantId).toEqual("");
})

test('tenantId from env', () => {
    const config = Config.default.envSet({
        EITHUB_TENANT_ID: "some string"
    })
    expect(config.tenantId).toBe("some string");
})

test('default clientId is ""', () => {
    expect(Config.default.clientId).toEqual("");
})

test('clientId from env', () => {
    const config = Config.default.envSet({
        EITHUB_CLIENT_ID: "some string"
    })
    expect(config.clientId).toBe("some string");
})

test('default clientSecret is ""', () => {
    expect(Config.default.clientSecret).toEqual("");
})

test('clientSecret from env', () => {
    const config = Config.default.envSet({
        EITHUB_CLIENT_SECRET: "some string"
    })
    expect(config.clientSecret).toBe("some string");
})