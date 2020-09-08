import "./widgets/eit-apps";
import "./widgets/eit-header";
import "./widgets/eit-hub";
import "./widgets/eit-main";

import Shuttle from "../../apps/shuttle/client/shuttle";

export default class EitHub {
    static init(): void {
        // initialize all services.

        // initialize widgets.

        // initialize all apps.
        this.initApps();
    }


    static initApps(): void {
        Shuttle.init();
    }
}