import WebSocket from './websocket.js';
import inputApp from './app.js';
import GamePad from './gamepad.js';

function main() {
    // Setup websocket.
    const websocket = new WebSocket();

    // Setup GamePad.
    const gamePad = new GamePad();

    // run classic app.
    inputApp(websocket, gamePad);
}

main();