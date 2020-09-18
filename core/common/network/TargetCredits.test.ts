import TargetCredits from "./TargetCredits";

test("The balance should be 1 less after successful request", () => {
    const c = new TargetCredits();
    c.balance = 2;
    c.sendRequest();
    expect(c.balance).toBe(1);
});

const pram: [number,boolean][] = [
    [1, true],
    [0, false],
    [-1, false],
]

pram.forEach(([credits, allowed]) => {
    test(`should ${allowed ? "allow" : "disallow"} request if balance is ${credits}`, () => {
        const c = new TargetCredits();
        c.balance = credits;
        expect(c.sendRequest()).toBe(allowed);
    })
})