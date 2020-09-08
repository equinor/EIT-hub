import html from "./eit-main.html";

export default class EitMain extends HTMLElement{
    constructor() {
        super();

        const shadow = this.attachShadow({mode:'closed'});
        shadow.innerHTML = html;

    }
}
