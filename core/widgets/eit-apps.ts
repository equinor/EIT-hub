import html from "./eit-apps.html";

export default class EitApps extends HTMLElement{
    constructor() {
        super();

        const shadow = this.attachShadow({mode:'closed'});
        shadow.innerHTML = html;

    }
}

customElements.define('eit-apps', EitApps);