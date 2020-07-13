export default class Input{
    constructor(websocket, gamePad, keyboard, view) {
        this._websocket = websocket;
        this._gamePad = gamePad;
        this._keyboard = keyboard;
        this._view = view;
    }

    start(poolInterval) {
        setInterval(this._possessInputs.bind(this), poolInterval);
    }

    _possessInputs() {
        let msg = {
            x: 0,
            y: 0,
            z: 0,
            r: 0
        }

        if (this._view.useGamePad()) {
            var axes = this._gamePad.getAxes();
            msg.y = axes[1];
            msg.x = axes[0];
            msg.z = axes[3];
            msg.r = axes[2];
        } else if (this._view.useKeyboard()) {
            if (this._keyboard.keyW()) {
                msg.y = 1;
            }
            if (this._keyboard.keyA()) {
                msg.x = -1;
            }
            if (this._keyboard.keyS()) {
                msg.y = -1;
            }
            if (this._keyboard.keyD()) {
                msg.x = 1;
            } 
            if (this._keyboard.keyUp()) {
                msg.z = 1;
            }
            if (this._keyboard.keyLeft()) {
                msg.r = -1;
            }
            if (this._keyboard.keyDown()) {
                msg.z = -1;
            }
            if (this._keyboard.keyRight()) {
                msg.r = 1;
            }
        }

        this._websocket.sendInput(msg);
        this._view.setData(msg);
    }
}