export default class ClientRequestView{
    constructor(websocket,element) {
        this._rootElem = element;
        this._websocket = websocket;
        let self = this;

        this._rootElem.querySelector("#requestControlButton").onclick = function() {
            self._websocket.sendControlRequest(true);
        }

        this._rootElem.querySelector("#cancelControlButton").onclick = function() {
            self._websocket.sendControlRequest(false);
        }
    }

    updateControl(msg) {

        if (msg.body) {
            this._rootElem.querySelector("#requestAnswer").innerText = "You have control";
        } else {
            this._rootElem.querySelector("#requestAnswer").innerText = "You are not in control"
        }
    }
}