export default class TelemetryView {
    constructor(element) {
        this._rootElem = element;
    }

    updateTelemetry(json) {
        let telemetry = json.telemetry_list;
        console.log(telemetry);
        if (telemetry.armed !== 0) {
            this._rootElem.querySelector("#circle_3").style.fill = "green";
            this._rootElem.querySelector("#text_4").textContent = "Armed";
        } else {
            this._rootElem.querySelector("#circle_3").style.fill = "red";
            this._rootElem.querySelector("#text_4").textContent = "Disarmed";
        }

        this._rootElem.querySelector("#telemetry-view").innerText = "Flightmode: "+ telemetry.flightmode + "\r\n" +
        "Altitude: "+ telemetry.alt + "\r\n" + "Heading: "+ telemetry.heading + "\r\n" +
        "Translation (x) speed: "+ telemetry.vx + "\r\n" + "Translation (y) speed: " + telemetry.vy + "\r\n" + "Vertical speed:" + telemetry.vz; 
    }
}