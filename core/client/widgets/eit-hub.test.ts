import EitHub from "./eit-hub";

test("EitHub smoke test", () => {
    const eitHub = new EitHub();
    expect(eitHub).toBeInstanceOf(HTMLElement);
});