import EitApps from "./eit-apps";

test("Eit Apps dom", () => {
    const eitApps = document.createElement("eit-apps");
    expect(eitApps).toBeInstanceOf(EitApps);
});