import WebSocket from './websocket.js';
import GamePad from './gamepad.js';
import Keyboard from './keyboard.js';
import InputView from './inputView.js';
import Input from './input.js';
import TelemetryView from './telemetryView.js';
import VideoView from './videoView.js';
import RtcConnector from './rtcConnector.js';
import ClientRequestView from './clientRequests.js';

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

    // Setup VideoView
    //const videoView = new VideoView(document.getElementById('video-view'));

    // Setup RtcConnector
    //const rtcConnector = new RtcConnector(websocket, videoView);

    // Setup ClientRequests
    const clientRequestView = new ClientRequestView(websocket,document.getElementById('clientRequests'))
    websocket.onControl(clientRequestView.updateControl.bind(clientRequestView));

    // Start client
    input.start(200);
    //rtcConnector.start();
}

main();
