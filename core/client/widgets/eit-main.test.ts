import EitMain from "./eit-main";

test("EitMain from dom", () => {
    const eitMain = document.createElement("eit-main");
    expect(eitMain).toBeInstanceOf(EitMain);
});