import EitHeader from "./eit-header";

test("EitHeader dom test", () => {
    const eitHeader = document.createElement('eit-header');
    expect(eitHeader).toBeInstanceOf(EitHeader);
});

test("EitHeader custom constructor", () => {
    const eitHeader = new EitHeader(42);
    expect(eitHeader.value).toBe(42);
});