import WebSocket from './websocket.js';
import inputApp from './app.js';
import GamePad from './gamepad.js';
import Keyboard from './keyboard.js';

function main() {
    // Setup websocket.
    const websocket = new WebSocket();

    // Setup GamePad.
    const gamePad = new GamePad();

    // Setup Keyboard.
    const keyboard = new Keyboard(window);

    // run classic app.
    inputApp(websocket, gamePad, keyboard);
}

main();