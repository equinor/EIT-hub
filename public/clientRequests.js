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
        let browserId = msg.body;
        let feedbackText = "";
        if (browserId === null) {
            feedbackText = 'No one is in control of the shuttle.'
        } else {
            feedbackText = `Browser ${browserId} is in control of shuttle.`
        }
        this._rootElem.querySelector("#requestAnswer").innerText = feedbackText;
        
    }
}