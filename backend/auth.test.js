const Auth = require("./auth");

test("getDeviceToken http", () => {
    var config = {
        baseUrl: new URL("http://localhost/")
    }
    var auth = new Auth(config);

    var key = auth.getDeviceToken("test");
    expect(key.url.toString()).toBe("ws://localhost/device/test");
    expect(key.authorization).toBe(`Bearer ${key.token}`);
});

test("getDeviceToken https", () => {
    var config = {
        baseUrl: new URL("https://localhost/")
    }
    var auth = new Auth(config);

    var key = auth.getDeviceToken("test");
    expect(key.url.toString()).toBe("wss://localhost/device/test");
    expect(key.authorization).toBe(`Bearer ${key.token}`);
});