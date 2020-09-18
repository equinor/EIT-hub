export default class MyCredits {
    constructor(private _credits: number = 10) {

    }

    get balance() : number {
        return this._credits
    }

    dec(): void {
        this._credits -= 1;
    }

    inc(): void {
        this._credits += 1;
    }
}