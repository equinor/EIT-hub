/**
 * Keeps track of how many messages you can send on a connection.
 * Etch message cost one credit.
 * And you should never send messages if the balance is zero or negative.
 * Update balance from received messages.
 */
export default class TargetCredits {
    private _credits = 10;

    /** Ask to be able to send a message.
     * If return true a credits is used an you can send that message.
     * If returns false you must abort message.
     */
    sendRequest(): boolean {
        if(this._credits > 0) {
            this._credits -= 1;
            return true;
        }
        return false;
    }

    /** Get the number of messages you can send. 
     * It can be a negative number.
     */
    get balance(): number {
        return this._credits;
    }

    /** Updated balance from the other side. */
    set balance(credits: number) {
        this._credits = credits;
    }
}