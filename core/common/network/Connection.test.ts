import Connection from "./Connection";
import IWebSocket from "./IWebSocket";

class TestWebSocket implements IWebSocket {
    send(data: string): void {
        this.sent = data
    }
    onMessage: ((data: string) => void) | undefined;
    isConnected = true;
    onConnectionChange: ((connected: boolean) => void) | undefined;
    close(): void {
        throw new Error("Method not implemented.");
    }

    sent = "";
}

test("No connection happy path", () => {
    const c = new Connection();

    expect(c.isOnline()).toBe(false);
    expect(c.send("some data")).toBe(false);
    expect(c.webSocket).toBeUndefined();
});

test("Send message", () => {
    const ws = new TestWebSocket();
    const c = new Connection(ws);

    expect(c.send("some data")).toBe(true);
    expect(ws.sent).toBe("some data");
});

test("Get message", () => {
    const callback = jest.fn();
    const ws = new TestWebSocket();
    const c = new Connection(ws);
    c.onMessage = callback;

    ws.onMessage?.("some data");
    
    expect(callback).toHaveBeenCalledWith("some data");
});

test("Get message when websocket get set after the fact", () => {
    const callback = jest.fn();
    const c = new Connection();
    c.onMessage = callback;

    const ws = new TestWebSocket();
    c.webSocket = ws;
    ws.onMessage?.("some data");
    
    expect(callback).toHaveBeenCalledWith("some data");
});

test("clean disconnect", () => {
    const mock = jest.fn();
    const ws = new TestWebSocket();
    const c = new Connection(ws);
    c.onOnline = mock;

    ws.onConnectionChange?.(false);

    expect(ws.onMessage).toBeUndefined();
    expect(ws.onConnectionChange).toBeUndefined();
    expect(mock).toHaveBeenCalledWith(false);
});

test("Get message with no callback", () => {
    const ws = new TestWebSocket();
    new Connection(ws);

    ws.onMessage?.("some message");
    // Expect to not throw.
});

test("Get message with no callback", () => {
    const ws = new TestWebSocket();
    new Connection(ws);

    ws.onMessage?.("some message");
    // Expect to not throw.
});

test("Do nothing on connection changed to true", () => {
    const ws = new TestWebSocket();
    const c = new Connection(ws);

    ws.onConnectionChange?.(true);
    expect(c.webSocket).toBe(ws);
});