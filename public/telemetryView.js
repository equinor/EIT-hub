export default class TelemetryView {
    constructor(element) {
        this._rootElem = element;
    }

    updateTelemetry(json) {
        let msg = JSON.stringify(json);
        this._rootElem.innerText = "x: "+ json.desired_thrust.x.toFixed(5) +
        "   y: "+ json.desired_thrust.y.toFixed(5) + "   z: "+ json.desired_thrust.z.toFixed(5) +
        "   r: "+ json.desired_thrust.r.toFixed(5);
    }
}