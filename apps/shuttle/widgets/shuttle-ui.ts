import WebSocket from './shuttle-ui/websocket';
import GamePad from './shuttle-ui/gamepad';
import Keyboard from './shuttle-ui/keyboard';
import InputView from './shuttle-ui/inputView';
import Input from './shuttle-ui/input';
import TelemetryView from './shuttle-ui/telemetryView';
import ClientRequestView from './shuttle-ui/clientRequests';
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

customElements.define('shuttle-ui', ShuttleUi);
