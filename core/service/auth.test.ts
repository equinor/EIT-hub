import Auth from "./auth";
import Config from "./config";
import {URL} from "url";

test("getDeviceToken http", () => {
    const config = Config.default.set({
        baseUrl: new URL("http://localhost/")
    });
    const auth = new Auth(config);

    const key = auth.getDeviceToken("test");
    expect(key.url.toString()).toBe("ws://localhost/device/test");
    expect(key.authorization).toBe(`Bearer ${key.token}`);
});

test("getDeviceToken https", () => {
    const config = Config.default.set({
        baseUrl: new URL("https://localhost/")
    });
    const auth = new Auth(config);

    const key = auth.getDeviceToken("test");
    expect(key.url.toString()).toBe("wss://localhost/device/test");
    expect(key.authorization).toBe(`Bearer ${key.token}`);
});