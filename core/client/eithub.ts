import 'wired-elements';

import EitApps from "./widgets/eit-apps";
import EitHeader from "./widgets/eit-header";
import EitHubWidget from "./widgets/eit-hub";
import EitMain from "./widgets/eit-main";

import Shuttle from "../../apps/shuttle/client/shuttle";

export default class EitHub {
    static init(): void {
        // initialize all services.
        this.initServices();

        // initialize widgets.
        this.initWidgets();

        // initialize all apps.
        this.initApps();
    }

    static initServices(): void {
        //None yet
    }

    static initWidgets(): void {
        customElements.define('eit-apps', EitApps);
        customElements.define('eit-header', EitHeader);
        customElements.define('eit-hub', EitHubWidget);
        customElements.define('eit-main', EitMain);
    }

    static initApps(): void {
        Shuttle.init();
    }
}