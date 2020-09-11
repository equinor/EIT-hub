import { KeepAlive, credits, decodeMessage } from "./message";
import { JsonDecoder } from "ts.data.json";

test("keep alive",  () => {
    expect(KeepAlive).toStrictEqual({
        credit: 0,
        type: "none",
        payload: {}
    })
});

test("credits",  () => {
    const msg = credits(42);

    expect(msg).toStrictEqual({
        credit: 42,
        type: "none",
        payload: {}
    })
});

test("json happy path",  () => {
    const msg = decodeMessage({
        credit: 0,
        type: "test",
        payload: "test payload"
    }, JsonDecoder.string);

    if(msg.isOk()) {
        expect(msg.value).toStrictEqual({
            credit: 0,
            type: "test",
            payload: "test payload"
        })
    }else {
        fail(msg.error);
    }
});

test("json fail",  () => {
    const msg = decodeMessage({
        credit: 0,
        payload: "test payload"
    }, JsonDecoder.string);

    if(msg.isOk()) {
        fail("should error")
    }
});