export default class TelemetryView {
    constructor(private rootElem:HTMLElement) {
    }

    updateTelemetry(json:any) {
        let telemetry = json.telemetry_list;
        console.log(telemetry);
        if (telemetry.armed !== 0) {
            this.rootElem.querySelector<HTMLElement>("#circle_3")!.style.fill = "green";
            this.rootElem.querySelector("#text_4")!.textContent = "Armed";
        } else {
            this.rootElem.querySelector<HTMLElement>("#circle_3")!.style.fill = "red";
            this.rootElem.querySelector("#text_4")!.textContent = "Disarmed";
        }

        this.rootElem.querySelector<HTMLElement>("#telemetry-view")!.innerText = "Flightmode: "+ telemetry.flightmode + "\r\n" +
        "Altitude: "+ telemetry.alt + "\r\n" + "Heading: "+ telemetry.heading + "\r\n" +
        "Translation (x) speed: "+ telemetry.vx + "\r\n" + "Translation (y) speed: " + telemetry.vy + "\r\n" + "Vertical speed:" + telemetry.vz; 
    }
}