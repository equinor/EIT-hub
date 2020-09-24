export default interface ISender {
    canSend(): boolean,
    send(topic:string, payload: unknown): boolean,
}