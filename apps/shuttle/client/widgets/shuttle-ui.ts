/* istanbul ignore file */
import WebSocket from '../websocket';
import GamePad from '../gamepad';
import Keyboard from '../keyboard';
import InputView from '../inputView';
import Input from '../input';
import TelemetryView from '../telemetryView';
import ClientRequestView from '../clientRequests';
import html from './shuttle-ui.html';

export default class ShuttleUi extends HTMLElement {
    constructor(){
        super();

        const shadow = this.attachShadow({mode: 'open'});
    
        shadow.innerHTML = html;

        // Setup websocket.
        const websocket = new WebSocket();

        // Setup Telemetry
        const telemetryView = new TelemetryView(shadow.querySelector<HTMLElement>('#telemetry')!);
        websocket.onTelemetry(telemetryView.updateTelemetry.bind(telemetryView));

        // Setup GamePad.
        const gamePad = new GamePad();

        // Setup Keyboard.
        const keyboard = new Keyboard(window);

        // Setup InputView.
        const inputView = new InputView(shadow.querySelector<HTMLElement>('#input-view')!);

        // Setup Input
        const input = new Input(websocket,gamePad,keyboard,inputView);

        // Setup ClientRequests
        const clientRequestView = new ClientRequestView(websocket,shadow.querySelector<HTMLElement>('#clientRequests')!)
        websocket.onControl(clientRequestView.updateControl.bind(clientRequestView));

        // Start client
        input.start(200);
    }
}
