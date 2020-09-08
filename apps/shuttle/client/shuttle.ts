import ShuttleUi from "./widgets/shuttle-ui";

export default class Shuttle {
    static init(): void {
        // Start widgets
        customElements.define('shuttle-ui', ShuttleUi);
    }
}