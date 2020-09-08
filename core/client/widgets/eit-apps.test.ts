import EitApps from "./eit-apps";

test("Eit Apps smoke test", () => {
    const eitApps = new EitApps;
    expect(eitApps).toBeInstanceOf(HTMLElement);
});