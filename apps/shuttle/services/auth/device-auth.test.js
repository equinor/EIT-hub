const DeviceAuth = require("./device-auth");
const Time = require("../utils/time");

function time2020() {
    const time = new Time();
    time.nowOverride = new Date(2020,0,0);
    return time;
}

function addTime(time, secs) {
    time.nowOverride = new Date(time.nowOverride.getTime() + secs * 1000);
}

test('Happy path accepted', () => {
    let time = time2020();

    let auth = new DeviceAuth(time);
    let key = auth.generateKey("test");
    expect(auth.checkKey(key, "test")).toBe(true);
});

test('Happy path reject', () => {
    let time = time2020();

    let auth = new DeviceAuth(time);
    let key = auth.generateKey("test");
    expect(auth.checkKey("not the key", "test")).toBe(false);
});

test('Timeout', () => {
    let time = time2020();

    let auth = new DeviceAuth(time);
    let key = auth.generateKey("test");
    addTime(time, 61);
    expect(auth.checkKey(key, "test")).toBe(false);
});

test('Just accepted', () => {
    let time = time2020();

    let auth = new DeviceAuth(time);
    let key = auth.generateKey("test");
    addTime(time, 60);
    expect(auth.checkKey(key, "test")).toBe(true);
});

test('Wrong device', () => {
    let time = time2020();

    let auth = new DeviceAuth(time);
    let key = auth.generateKey("test");
    expect(auth.checkKey(key, "test2")).toBe(false);
});