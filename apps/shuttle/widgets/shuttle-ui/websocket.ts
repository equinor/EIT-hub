export default class WebSocket{
    private _ws = new window.WebSocket(getWsUrl());
    private _telemetryCallbacks:any[] = [];
    private _controlCallbacks:any[] = [];
    private _rtcCallbacks:any[] = [];

    constructor(){
        this._ws.onmessage = this._onMessage.bind(this);

    }

    /** Try to send input information to the server. Do nothing if connection is not working.
     * 
     * @param {{x:number, y:number, z:number, r:number}} input 
     */
    sendInput(input: { x: number; y: number; z: number; r: number; }):void {
        const msg = {type: "input", body: input}
        this._ws.send(JSON.stringify(msg));
    }

    /** Ask server to let us have control or give up our control. Do nothing if connection is not working.
     * 
     */
    sendControlRequest(bool: boolean):void {
        const msg = {type: "inputControl", body: bool}
        this._ws.send(JSON.stringify(msg));
    }

    sendShuttleCommand(type: any,value: any):void {
        const msg = {type: type, body: value}
        this._ws.send(JSON.stringify(msg));
    }

    /** Send rtc request or client SDP. 
     *
     *@param {any} msg 
     */
    sendRtc(rtcMsg: any):void{
        const msg = { type: "rtc", body: rtcMsg };
        this._ws.send(JSON.stringify(msg));
    }

    /** 
     * 
     */
    onControl(callback: any): void {
        this._controlCallbacks.push(callback);
    }

    onTelemetry(callback: any): void {
        this._telemetryCallbacks.push(callback);
    }

    onRtc(callback: any): void {
        this._rtcCallbacks.push(callback);
    }

    _onMessage(event: MessageEvent):void {
        const msg = JSON.parse(event.data);

        if(msg.type === "inputControl") {
            for (const callback of this._controlCallbacks) {
                callback(msg)
            }
        }else if(msg.type === "telemetry") {
            for (const callback of this._telemetryCallbacks) {
                callback(msg)
            }
        } else if(msg.type === "rtc") {
            console.log(msg);
            for (const callback of this._rtcCallbacks) {
                callback(msg);   
            }
        } else {
            console.warn("Unknown message from server:", msg);
        }
    }
}

function getWsUrl() {
    const loc = window.location
    let new_uri;
    if (loc.protocol === "https:") {
        new_uri = "wss:";
    } else {
        new_uri = "ws:";
    }
    new_uri += "//" + loc.host;
    new_uri += "/browser";

    return new_uri
}
