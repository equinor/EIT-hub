export default class InputView{
    constructor(element) {
        this._rootElem = element;

        // 1: GamePad
        // 2: Keyboard
        this._selection = 0;

        let self = this;

        this._rootElem.querySelector("#gamepad-button").onclick = function() {
            self._selection = 1;
        }

        
        this._rootElem.querySelector("#keyboard-button").onclick = function() {
            self._selection = 2;
        }
    }

    useKeyboard() {
        return this._selection === 2;
    }

    useGamePad() {
        return this._selection === 1;
    }

    setData(msg) {
        this._rootElem.querySelector("#dataText")
            .innerText = `x: ${msg.x}  y: ${msg.y}  z: ${msg.z}  r: ${msg.r}  `;
    }
}