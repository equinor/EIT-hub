import EitHeader from "./eit-header";

test("EitHeader from dom", () => {
    const eitHeader = document.createElement("eit-header");
    expect(eitHeader).toBeInstanceOf(EitHeader);
});