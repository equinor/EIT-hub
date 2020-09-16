export default interface IWebSocket {
    onMessage(callback: (data:string) => void): void,
    onConnectionChange(callback: (connected: boolean) => void): void,

    readonly isConnected: boolean
    send(data:string): void;
    close(code?: number, reason?: string): void;
} 