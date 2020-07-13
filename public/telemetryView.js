export default class TelemetryView {
    constructor(element) {
        this._rootElem = element;
    }

    updateTelemetry(json) {
        this._rootElem.innerText = JSON.stringify(json);
    }
}