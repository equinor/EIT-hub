export default class InputView{
    constructor(element) {
        this._rootElem = element;

        // 1: GamePad
        // 2: Keyboard
        this._selection = 0;

        let self = this;

        this._rootElem.querySelector("#gamepad-button").onclick = function() {
            self._selection = 1;

            self._rootElem.querySelector("#gamepad-info").style.display='block';
            self._rootElem.querySelector("#keyboard-info").style.display='none';
        }

        
        this._rootElem.querySelector("#keyboard-button").onclick = function() {
            self._selection = 2;

            self._rootElem.querySelector("#keyboard-info").style.display='block';
            self._rootElem.querySelector("#gamepad-info").style.display='none';
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
            .innerText = ` Input values:\n x: ${msg.x.toFixed(5)}  y: ${msg.y.toFixed(5)}  z: ${msg.z.toFixed(5)}  r: ${msg.r.toFixed(5)}  `;
    }
}