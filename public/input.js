export default class Input{
    constructor(websocket, gamePad, keyboard, view) {
        this._websocket = websocket;
        this._gamePad = gamePad;
        this._keyboard = keyboard;
        this._view = view;
        
        this.gainPressed = 0.005;
        this.gainRelease = 0.01;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.r = 0;
    }

    start(poolInterval) {
        setInterval(this._possessInputs.bind(this), poolInterval);
    }

    _possessInputs() {
        
        if (this._view.useGamePad()) {
            var axes = this._gamePad.getAxes();
            this.y = axes[1];
            this.x = axes[0];
            this.z = axes[3];
            this.r = axes[2];

        } else if (this._view.useKeyboard()) {
            
            // y
            if (this._keyboard.keyW() || this._keyboard.keyS()) {

                if (this._keyboard.keyW()) {
                    this.y += this.gainPressed;
                    if (this.y > 1) this.y = 1;

                } else if (this._keyboard.keyS()) {
                    this.y -= this.gainPressed;
                    if (this.y < -1)  this.y = -1; 
                }
            } else {
                if (this.y > 0.06 || this.y < -0.06) {
                    let sign = this.y/Math.abs(this.y);
                    this.y -= sign*this.gainRelease;
                } else {
                    this.y = 0;
                }
            }

            // x
            if (this._keyboard.keyA() || this._keyboard.keyD()) {

                if (this._keyboard.keyD()) {
                    this.x += this.gainPressed;
                    if (this.x > 1) this.x = 1;

                } else if (this._keyboard.keyA()) {
                    this.x -= this.gainPressed;
                    if (this.x < -1)  this.x = -1; 
                }
            } else {
                if (this.x > 0.06 || this.x < -0.06) {
                    let sign = this.x/Math.abs(this.x);
                    this.x -= sign*this.gainRelease;
                } else {
                    this.x = 0;
                }
            }

            // z
            if (this._keyboard.keyUp() || this._keyboard.keyDown()) {

                if (this._keyboard.keyUp()) {
                    this.z += this.gainPressed;
                    if (this.z > 1) this.z = 1;

                } else if (this._keyboard.keyDown()) {
                    this.z -= this.gainPressed;
                    if (this.z < -1)  this.z = -1; 
                }
            } else {
                if (this.z > 0.06 || this.z < -0.06) {
                    let sign = this.z/Math.abs(this.z);
                    this.z -= sign*this.gainRelease;
                } else {
                    this.z = 0;
                }
            }

            // r
            if (this._keyboard.keyRight() || this._keyboard.keyLeft()) {

                if (this._keyboard.keyRight()) {
                    this.r += this.gainPressed;
                    if (this.r > 1) this.r = 1;

                } else if (this._keyboard.keyLeft()) {
                    this.r -= this.gainPressed;
                    if (this.r < -1)  this.r = -1; 
                }
            } else {
                if (this.r > 0.06 || this.r < -0.06) {
                    let sign = this.r/Math.abs(this.r);
                    this.r -= sign*this.gainRelease;
                } else {
                    this.r = 0;
                }
            } 
        }

        let msg = {
            y: this.y,
            x: this.x,
            z: this.z,
            r: this.r
        }

        this._websocket.sendInput(msg);
        this._view.setData(msg);
    }
}
