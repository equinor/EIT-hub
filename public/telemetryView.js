export default class TelemetryView {
    constructor(element) {
        this._rootElem = element;
    }

    updateTelemetry(json) {
        let msg = JSON.stringify(json);
        let telemtery = msg.telemetry_list;
        if (telemtery.armed) {
            this._rootElem.querySelector("#circle_3").style.fill = "green";
        } else {
            this._rootElem.querySelector("#circle_3").style.fill = "red";
        }

        this._rootElem.querySelector("#telemetry_view").innerText = "Flightmode: "+ telemtery.flightmode + "\r\n" +
        "Altitud: "+ telemtery.alt + "\r\n" + "Heading: "+ telemtery.heading + "\r\n" +
        "Vx: "+ telemtery.vx;
    }
}