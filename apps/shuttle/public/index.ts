import WebSocket from './websocket';
import GamePad from './gamepad';
import Keyboard from './keyboard';
import InputView from './inputView';
import Input from './input';
import TelemetryView from './telemetryView';
import ClientRequestView from './clientRequests';
import html from './index.html';

export default function main(): HTMLElement {
    // Parse Dom
    const parser = new DOMParser();

    const doc = parser.parseFromString(html, "text/html");

    // Setup websocket.
    const websocket = new WebSocket();

    // Setup Telemetry
    const telemetryView = new TelemetryView(doc.getElementById('telemetry')!);
    websocket.onTelemetry(telemetryView.updateTelemetry.bind(telemetryView));

    // Setup GamePad.
    const gamePad = new GamePad();

    // Setup Keyboard.
    const keyboard = new Keyboard(window);

    // Setup InputView.
    const inputView = new InputView(doc.getElementById('input-view')!);

    // Setup Input
    const input = new Input(websocket,gamePad,keyboard,inputView);

    // Setup ClientRequests
    const clientRequestView = new ClientRequestView(websocket,doc.getElementById('clientRequests')!)
    websocket.onControl(clientRequestView.updateControl.bind(clientRequestView));

    // Start client
    input.start(200);

    return doc.body.firstChild as HTMLElement;
}
