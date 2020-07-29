export default class TelemetryView {
    constructor(element) {
        this._rootElem = element;
    }

    updateTelemetry(json) {
        let telemetry = json.telemetry_list;
        console.log(telemetry);
        if (telemetry.armed !== 0) {
            this._rootElem.querySelector("#circle_3").style.fill = "green";
        } else {
            this._rootElem.querySelector("#circle_3").style.fill = "red";
        }

        this._rootElem.querySelector("#telemetry-view").innerText = "Flightmode: "+ telemetry.flightmode + "\r\n" +
        "Altitude: "+ telemetry.alt + "\r\n" + "Heading: "+ telemetry.heading + "\r\n" +
        "Vx: "+ telemetry.vx; 
    }
}