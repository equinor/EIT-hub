import html from "./eit-hub.html";
import '../../apps/shuttle/widgets/shuttle-ui';
import './eit-main';

export default class EitHub extends HTMLElement{
    constructor() {
        super();

        const shadow = this.attachShadow({mode:'closed'});
        shadow.innerHTML = html;

    }
}

customElements.define('eit-hub', EitHub);