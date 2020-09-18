import MyCredits from "./MyCredits";

test("default balance is 10", () => {
    const c = new MyCredits();
    expect(c.balance).toBe(10);
});

test("dec should decrement balance by one", () => {
    const c = new MyCredits(10);
    c.dec();
    expect(c.balance).toBe(9);
});

test("inc should increment balance by one", () => {
    const c = new MyCredits(10);
    c.inc();
    expect(c.balance).toBe(11);
});