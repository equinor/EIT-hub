export default interface IConnection {
    isOnline(): boolean;
    onOnline?: ((online: boolean) => void);
    send(msg: string): boolean;
    onMessage?: (data:string) => void;
}
