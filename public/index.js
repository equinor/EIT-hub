import WebSocket from './websocket.js';
import inputApp from './app.js';

function main() {
    // Setup websocket.
    const websocket = new WebSocket();

    // run classic app.
    inputApp(websocket);
}

main();