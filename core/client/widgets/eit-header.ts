import html from "./eit-header.html";

export default class EitHeader extends HTMLElement{
    constructor() {
        super();

        const shadow = this.attachShadow({mode:'closed'});
        shadow.innerHTML = html;

    }
}
