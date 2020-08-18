import WebSocket from "./websocket";

export default class ClientRequestView{

    constructor(private websocket: WebSocket, private rootElem: HTMLElement) {
        this.rootElem.querySelector<HTMLElement>("#requestControlButton")!.onclick = () => {
            this.websocket.sendControlRequest(true);
            this.rootElem.querySelector<HTMLInputElement>("#flight-modes")!.value = "none";
        }

        this.rootElem.querySelector<HTMLElement>("#cancelControlButton")!.onclick = () => {
            this.websocket.sendControlRequest(false);
        }

        this.rootElem.querySelector<HTMLElement>("#arm-button")!.onclick = () => {
            this.websocket.sendShuttleCommand("armShuttle",true);
        }

        this.rootElem.querySelector<HTMLElement>("#disarm-button")!.onclick = () => {
            this.websocket.sendShuttleCommand("armShuttle",false);
        }
    }

    public updateControl(msg:any):void {
        const userName = msg.body;
        let feedbackText = "";
        if (userName === null) {
            feedbackText = 'No one is in control of the shuttle.'
        } else {
            feedbackText = `${userName} is in control of shuttle.`
        }
        this.rootElem.querySelector<HTMLElement>("#requestAnswer")!.innerText = feedbackText;
        
    }
}