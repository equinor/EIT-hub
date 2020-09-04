import html from "./eit-hub.html";
import '../../apps/shuttle/widgets/shuttle-ui';
import './eit-header';
import './eit-apps';
import './eit-main';
import 'wired-elements';

export default class EitHub extends HTMLElement{
    constructor() {
        super();

        const shadow = this.attachShadow({mode:'closed'});
        shadow.innerHTML = html;

    }
}

customElements.define('eit-hub', EitHub);