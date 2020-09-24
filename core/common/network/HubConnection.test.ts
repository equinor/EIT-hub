import HubConnection from "./HubConnection"
import IConnection from "./IConnection";
import MyCredits from "./MyCredits";
import TargetCredits from "./TargetCredits";

class Connection implements IConnection {
    isOnline(): boolean {
        return this.online;
    }

    send(msg: string): boolean {
        this.sent = msg;
        return this.online;
    }
    onMessage: ((data: string) => void) | undefined;

    online = true;
    sent = "";
}

test("canSend true when online and have balance", () => {
    const con = new Connection();
    const hub = new HubConnection(con);

    expect(hub.canSend()).toBe(true);
})

test("canSend false if offline", () => {
    const con = new Connection();
    con.online = false;
    const hub = new HubConnection(con);

    expect(hub.canSend()).toBe(false);
})

test("canSend false if no balance", () => {
    const con = new Connection();
    const target = new TargetCredits();
    target.balance = 0;
    const hub = new HubConnection(con,undefined, target);

    expect(hub.canSend()).toBe(false);
})

test("send happy path", () => {
    const con = new Connection();
    const hub = new HubConnection(con);

    hub.send("test", 42);

    expect(con.sent).toBe('{"credits":10,"topic":"test","payload":42}');
})

test("send no credits", () => {
    const con = new Connection();
    const target = new TargetCredits();
    target.balance = 0;
    const hub = new HubConnection(con,undefined, target);

    expect(hub.send("test", 42)).toBe(false);
})

test("send failure", () => {
    const con = new Connection();
    con.online = false;
    const target = new TargetCredits();
    target.balance = 1;
    const hub = new HubConnection(con,undefined, target);

    expect(hub.send("test", 42)).toBe(false);
    expect(target.balance).toBe(1);
})

test("onMessage do not fail if no callback is set", () => {
    const con = new Connection();
    new HubConnection(con);

    expect(con.onMessage).toBeDefined();

    con.onMessage?.("test");
    // Expect to not throw.
})

test("onMessage happy path", done => {
    const con = new Connection();
    const my = new MyCredits(10);
    const target = new TargetCredits();
    const hub = new HubConnection(con, my, target);

    hub.onMessage = function(topic, payload) {
        try {
            expect(topic).toBe("test");
            expect(payload).toBe(42);
            expect(my.balance).toBe(9);
        } catch (err) {
            done(err);
        }
        return Promise.resolve();
    }

    con.onMessage?.('{"topic":"test","credits":-5,"payload":42}');
    setImmediate(() => {
        try {
            expect(my.balance).toBe(10);
            expect(target.balance).toBe(-5);
            done();
        } catch (err) {
            done(err);
        }
    });
})

test("onMessage swallow errors for now", done => {
    const con = new Connection();
    const hub = new HubConnection(con);

    hub.onMessage = function() {
        done("not expected to be called.");
        return Promise.resolve();
    }

    con.onMessage?.('"Not valid message"');
    done();
})