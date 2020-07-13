import WebSocket from './websocket.js';
import GamePad from './gamepad.js';
import Keyboard from './keyboard.js';
import InputView from './inputView.js';
import Input from './input.js';
import TelemetryView from './telemetryView.js';

function main() {
    // Setup websocket.
    const websocket = new WebSocket();

    // Setup Telemetry
    const telemetryView = new TelemetryView(document.getElementById('telemetry-view'));
    websocket.onTelemetry(telemetryView.updateTelemetry.bind(telemetryView));

    // Setup GamePad.
    const gamePad = new GamePad();

    // Setup Keyboard.
    const keyboard = new Keyboard(window);

    // Setup InputView.
    const inputView = new InputView(document.getElementById('input-view'));

    // Setup Input
    let input = new Input(websocket,gamePad,keyboard,inputView);

    // Start possessing inputs.
    input.start(10);
}

main();