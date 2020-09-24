import ISender from "./ISender";

export default class TrafficScheduler {
    private queue: [string, unknown][] = [];
    private realtime: Map<string, unknown> = new Map<string, unknown>();
    private flushing = false;

    constructor(private sender: ISender) {

    }

    sendQueued(topic: string, payload: unknown): void {
        this.queue.push([topic,payload]);
        if(!this.flushing) {
            this.flush();
        }
    }

    sendBestEffort(topic: string, payload: unknown): void {
        this.realtime.set(topic, payload);
        if(!this.flushing) {
            this.flush();
        }
    }

    private flush(): void {
        this.flushing = true;

        while(this.sender.canSend()){
            // Lets empty the queue first;
            const msg = this.queue.shift();
            if(msg !== undefined) {
                if(!this.sender.send(msg[0], msg[1])) {
                    this.queue.push(msg);
                }
                continue;
            }

            // Then send best efforts messages.
            const first = this.realtime.entries().next()
            if(first.done !== true){
                if(this.sender.send(first.value[0], first.value[1])) {
                    this.realtime.delete(first.value[0]);
                }
                continue;
            }

            // I am done there is nothing more to send.
            this.flushing = false;
            return;
        }

        // I have more to send need to wait. Lets wait 10 ms.
        setTimeout(() => this.flush(), 10);
    }
}