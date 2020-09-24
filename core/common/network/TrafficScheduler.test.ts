import ISender from "./ISender";
import TrafficScheduler from "./TrafficScheduler"

class Sender implements ISender {
    canSend(): boolean {
        return this.setCanSend;
    }
    send(topic: string, payload: unknown): boolean {
        this.sent.push([topic, payload]);
        this.setCanSend = this.sendReturn;
        return this.sendReturn;
    }

    setCanSend = true;
    sent: [string,unknown][] = [];
    sendReturn = true;
}

test("sendQueued happy path", () => {
    const sender = new Sender();
    const traffic = new TrafficScheduler(sender);

    traffic.sendQueued("test", 42);
    expect(sender.sent[0]).toStrictEqual(["test", 42]);
})

test("sendBestEffort happy path", () => {
    const sender = new Sender();
    const traffic = new TrafficScheduler(sender);

    traffic.sendBestEffort("test", 42);
    expect(sender.sent[0]).toStrictEqual(["test", 42]);
    expect(sender.sent[1]).toBeUndefined();
})