export default class WebSocket{
    constructor(){
        this._ws = new window.WebSocket('ws://localhost:3000');

        this._ws.onmessage = this._onMessage.bind(this);
        this._telemetryCallbacks = [];
        this._controlCallbacks = [];
    }

    /** Try to send input information to the server. Do nothing if connection is not working.
     * 
     * @param {{x:number, y:number, z:number, r:number}} input 
     */
    sendInput(input) {
        input.type = "input";
        this._ws.send(JSON.stringify(input));
    }

    /** Ask server to let us have control. Do nothing if connection is not working.
     * 
     */
    sendControlRequest() {
        const msg = {type:"inputControl"}
        this._ws.send(JSON.stringify(msg));
    }

    /** 
     * 
     */
    onControl(callback) {
        this._controlCallbacks.push(callback);
    }

    onTelemetry(callback) {
        this._telemetryCallbacks.push(callback);
    }

    _onMessage(event) {
        var msg = JSON.parse(event.data);

        if(msg.type === "inputControl") {
            for (callback of this._controlCallbacks) {
                callback(msg)
            }
        }else if(msg.type === "telemetry") {
            for (callback of this._telemetryCallbacks) {
                callback(msg)
            }
        }else {
            console.warn("Unknown message from server:", msg);
        }
    }
}