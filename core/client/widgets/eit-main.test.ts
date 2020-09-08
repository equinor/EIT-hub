import EitMain from "./eit-main";

test("EitMain smoke test", () => {
    const eitMain = new EitMain();
    expect(eitMain).toBeInstanceOf(HTMLElement);
});