export default class WebSocket{
    private _ws = new window.WebSocket(getWsUrl());
    private _telemetryCallbacks:Function[] = [];
    private _controlCallbacks:Function[] = [];
    private _rtcCallbacks:Function[] = [];

    constructor(){
        this._ws.onmessage = this._onMessage.bind(this);

    }

    /** Try to send input information to the server. Do nothing if connection is not working.
     * 
     * @param {{x:number, y:number, z:number, r:number}} input 
     */
    sendInput(input: { x: number; y: number; z: number; r: number; }) {
        const msg = {type: "input", body: input}
        this._ws.send(JSON.stringify(msg));
    }

    /** Ask server to let us have control or give up our control. Do nothing if connection is not working.
     * 
     */
    sendControlRequest(bool: boolean) {
        const msg = {type: "inputControl", body: bool}
        this._ws.send(JSON.stringify(msg));
    }

    sendShuttleCommand(type: any,value: any) {
        const msg = {type: type, body: value}
        this._ws.send(JSON.stringify(msg));
    }

    /** Send rtc request or client SDP. 
     *
     *@param {any} msg 
     */
    sendRtc(rtcMsg: any){
        const msg = { type: "rtc", body: rtcMsg };
        this._ws.send(JSON.stringify(msg));
    }

    /** 
     * 
     */
    onControl(callback: Function) {
        this._controlCallbacks.push(callback);
    }

    onTelemetry(callback: Function) {
        this._telemetryCallbacks.push(callback);
    }

    onRtc(callback: Function) {
        this._rtcCallbacks.push(callback);
    }

    _onMessage(event: MessageEvent) {
        var msg = JSON.parse(event.data);

        if(msg.type === "inputControl") {
            for (let callback of this._controlCallbacks) {
                callback(msg)
            }
        }else if(msg.type === "telemetry") {
            for (let callback of this._telemetryCallbacks) {
                callback(msg)
            }
        } else if(msg.type === "rtc") {
            console.log(msg);
            for (let callback of this._rtcCallbacks) {
                callback(msg);   
            }
        } else {
            console.warn("Unknown message from server:", msg);
        }
    }
}

function getWsUrl() {
    var loc = window.location, new_uri;
    if (loc.protocol === "https:") {
        new_uri = "wss:";
    } else {
        new_uri = "ws:";
    }
    new_uri += "//" + loc.host;
    new_uri += "/browser";

    return new_uri
}
