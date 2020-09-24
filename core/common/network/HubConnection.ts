import { JsonDecoder } from "ts.data.json";
import IConnection from "./IConnection";
import IReceiver from "./IReceiver";
import ISender from "./ISender";
import MyCredits from "./MyCredits";
import TargetCredits from "./TargetCredits";

export default class HubConnection implements ISender, IReceiver {
    constructor(
        private _connection: IConnection,
        private _my: MyCredits = new MyCredits(),
        private _target: TargetCredits = new TargetCredits(),
    ) {
        this._connection.onMessage = (data: string) => {
            if(this.onMessage === undefined){
                return;
            }
            const msg = decode(data);
            if(typeof msg !== "string") {
                this._target.balance = msg.credits;
                this._my.dec();
                this.onMessage(msg.topic, msg.payload).finally(() => this._my.inc());
            }
        }
    }

    canSend(): boolean {
        return this._connection.isOnline() && this._target.canSend();
    }

    send(topic:string, payload: unknown): boolean {
        // Ask for credits;
        if(!this._target.sendRequest()){
            return false;
        }
        // Create payload
        const msg = encode({
            credits: this._my.balance,
            topic: topic,
            payload: payload,
        })

        if(this._connection.send(msg)){
            return true;
        }

        this._target.cancelRequest();
        return false;
    }

    onMessage: ((topic:string, payload: unknown) => Promise<void>) | undefined
}

interface Message {
    credits: number,
    topic: string,
    payload: unknown,
}

function encode(msg: Message): string{
    return JSON.stringify(msg);
}

function decode(msg: string): Message | string{
    const obj:unknown = JSON.parse(msg);
    const decode = messageDecoder.decode(obj);
    if(decode.isOk()) {
        return decode.value
    }else {
        return decode.error
    }
}

const messageDecoder = JsonDecoder.object<Message>({
    credits: JsonDecoder.number,
    topic: JsonDecoder.string,
    payload: JsonDecoder.succeed
}, "Message")