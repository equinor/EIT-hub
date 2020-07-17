export default class ClientRequests{
    constructor(websocket,element) {
        this._rootElem = element;
        this._websocket = websocket;
        this._control = false;
        let self = this;

        this._rootElem.querySelector("#requestControlButton").onclick = function() {
            self._websocket.sendControlRequest();
        }

    }

    updateControl(msg) {

        if (msg.answer) {
            this._rootElem.querySelector("#requestAnswer").innerText = "You have control";
        } else {
            this._rootElem.querySelector("#requestAnswer").innerText = "You are not in control"
        }
    }
}