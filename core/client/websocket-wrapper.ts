import { Sender, Receiver, createChannel } from "./channel";

export interface WebSocketWrapper {
    sender: Sender<string>,
    receiver: Receiver<string>,
}

/* istanbul ignore next */
export default function connect(url: URL): WebSocketWrapper {
    const ws = new window.WebSocket(url.toString());

    const send = createChannel<string>();
    send[1].on(ws.send);

    const receive = createChannel<string>();
    ws.onmessage = (msg) => {
        receive[0].send(msg.data);
    }



    return {
        sender:send[0],
        receiver: receive[1]
    };
}