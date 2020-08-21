export interface Sender<T> {
    send(msg: T): void;
}

export interface Receiver<T> {
    lastMsg(): T | undefined;
    on(callback: (msg: T) => void): void;
    off(callback: (msg: T) => void): void;
}

export function createChannel<T>(): [Sender<T>, Receiver<T>] {
    let lastMsg: T|undefined = undefined;
    let callbacks: ((msg: T) => void)[] = [];

    const sender = {
        send: function (msg: T) {
            lastMsg = msg;
            for (const callback of callbacks) {
                callback(msg);
            }
        }
    }

    const receiver = {
        lastMsg(){
            return lastMsg;
        },
        on(callback:(msg:T) => void) {
            callbacks = [...callbacks, callback];
        },
        off(callback:(msg:T) => void) {
            callbacks = callbacks.filter((c) => c !== callback);
        }
    }

    return [sender, receiver];
}