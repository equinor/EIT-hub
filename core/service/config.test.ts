import {URL} from 'url';
import Config from './config';

test('default port is 3000', () => {
    const config = new Config();
    expect(config.port).toEqual(3000);
})

test('port from env', () => {
    const config = new Config();
    config.applyEnv({
        EITHUB_PORT: "1234"
    })
    expect(config.port).toBe(1234);
})

test('default baseUrl is http://localhost:3000/', () => {
    const config = new Config();
    expect(config.baseUrl).toStrictEqual(new URL("http://localhost:3000/"));
})

test('baseUrl from env', () => {
    const config = new Config();
    config.applyEnv({
        EITHUB_BASE_URL: "http://example.com/"
    })
    expect(config.baseUrl).toStrictEqual(new URL("http://example.com/"));
})

test('default disableDeviceAuth is true', () => {
    const config = new Config();
    expect(config.disableDeviceAuth).toBe(false);
})

test('disableDeviceAuth from env', () => {
    const config = new Config();
    config.applyEnv({
        EITHUB_DISABLE_DEVICE_AUTH: "false"
    })
    expect(config.disableDeviceAuth).toBe(false);
})

test('disableDeviceAuth in prod', () => {
    const originalWarn = console.warn;
    console.warn = jest.fn();

    const config = new Config();
    config.applyEnv({
        EITHUB_DISABLE_DEVICE_AUTH: "true",
        EITHUB_BASE_URL: "http://example.com/"
    })
    expect(config.disableDeviceAuth).toBe(false);

    console.warn = originalWarn;
})

test('default iotHubConnectionString is ""', () => {
    const config = new Config();
    expect(config.iotHubConnectionString).toEqual("");
})

test('port from env', () => {
    const config = new Config();
    config.applyEnv({
        EITHUB_IOTHUB_CONNECTION_STRING: "some string"
    })
    expect(config.iotHubConnectionString).toBe("some string");
})