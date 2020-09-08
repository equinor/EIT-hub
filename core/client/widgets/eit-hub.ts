import html from "./eit-hub.html";

export default class EitHub extends HTMLElement{
    constructor() {
        super();

        const shadow = this.attachShadow({mode:'closed'});
        shadow.innerHTML = html;

    }
}

customElements.define('eit-hub', EitHub);