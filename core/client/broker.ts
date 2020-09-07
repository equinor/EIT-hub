import { Sender, Receiver, createChannel } from "./channel";

export class Topic<T> {
    private sender: Sender<T>;
    private receiver: Receiver<T>;
    
    constructor() {
        [this.sender, this.receiver] = createChannel<T>();
    }
    

    publish(msg: T): void {
        this.sender.send(msg);
    }

    subscribe(callback: (msg: T) => void): void {
        this.receiver.on(callback);
    }

    unsubscribe(callback: (msg: T) => void): void {
        this.receiver.off(callback);
    }

    get lastMsg(): T|undefined {
        return this.receiver.lastMsg();
    }
}

export class Broker {
    private topics: Map<string,Topic<unknown>> = new Map();
    
    createTopic(name: string): Topic<unknown> {
        const topic = new Topic<unknown>();
        this.topics.set(name, topic);
        return topic;
    }

    topic(name: string): Topic<unknown> | void {
        return this.topics.get(name);
    }
}