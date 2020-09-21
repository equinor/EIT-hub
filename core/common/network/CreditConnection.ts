import { JsonDecoder } from "ts.data.json";
import IConnection from "./IConnection";
import MyCredits from "./MyCredits";
import TargetCredits from "./TargetCredits";

export default class CreditConnection {
    constructor(
        private _connection: IConnection,
        private _my: MyCredits = new MyCredits(),
        private _target: TargetCredits = new TargetCredits(),
    ) {
        this._connection.onMessage = (data: string) => {
            if(this.onMessage === undefined){
                return;
            }
            const msgJson:unknown = JSON.parse(data);
            const msgDecode = messageDecoder.decode(msgJson);
            if(msgDecode.isOk()) {
                const msg = msgDecode.value;
                this._target.balance = msg.credits;
                this._my.dec();
                this.onMessage(msg.type, msg.payload).finally(() => this._my.inc());
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
        const msg = JSON.stringify({
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
    type: string,
    payload: unknown,
}

const messageDecoder = JsonDecoder.object<Message>({
    credits: JsonDecoder.number,
    type: JsonDecoder.string,
    payload: JsonDecoder.succeed
}, "Message")