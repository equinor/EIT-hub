export default interface IReceiver {
    onMessage: ((topic:string, payload: unknown) => Promise<void>) | undefined
}