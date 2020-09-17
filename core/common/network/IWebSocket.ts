export default interface IWebSocket {
    send(data:string): void;
    onMessage: ((data:string) => void) | undefined,

    readonly isConnected: boolean
    onConnectionChange: ((connected: boolean) => void) | undefined,

    close(code?: number, reason?: string): void;
} 