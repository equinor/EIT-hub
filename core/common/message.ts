import { JsonDecoder, Result } from 'ts.data.json';

export default interface Message<T> {
    readonly credit: number,
    readonly type: string,
    readonly payload: T
}

export type EmptyPayload = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in any] : never
}

export function decodeMessage<T>(json: unknown, decoder: JsonDecoder.Decoder<T>): Result<Message<T>> {
    const msgDecoder = JsonDecoder.object<Message<T>>({
        credit: JsonDecoder.number,
        type: JsonDecoder.string,
        payload: decoder
    },'Message');

    return msgDecoder.decode(json)
}

export const KeepAlive:Message<EmptyPayload> = {
    credit: 0,
    type: "none",
    payload: {}
}

export function credits(credits: number):Message<EmptyPayload> {
    return {
        credit: credits,
        type: "none",
        payload: {}
    }
}