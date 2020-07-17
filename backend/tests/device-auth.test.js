const Auth = require('../auth');
const BrowserWs = require('../browser-ws');
const DeviceWS = require('../device-ws');
const Express = require('../express');

const WebSocket = require('ws');

let auth;
let express;

beforeAll(() => {
    auth = new Auth({
        baseUrl: new URL("http://localhost:3123/")
    });

    express = new Express(3123, auth, new BrowserWs(), new DeviceWS());

    express.start();
});

afterAll(() => {
    express.stop();
});

test("Happy path device authentication", (done) => {
    let token = auth.getDeviceToken("test");

    let websocket = new WebSocket(token.url, {
        headers: {
            "Authorization": token.authorization
        }
    });

    websocket.on("open", () => {
        websocket.close();
        done();
    });

    websocket.on('error', (err) => {
        done(err);
    });
});

test("Wrong key", (done) => {
    let token = auth.getDeviceToken("test");

    let websocket = new WebSocket(token.url, {
        headers: {
            "Authorization": "Bearer pleaseLetMeIn"
        }
    });

    websocket.on("open", () => {
        websocket.close();
        done("Connection accepted with wrong key");
    });

    websocket.on('error', (err) => {
        done();
    });
});