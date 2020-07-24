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

        this.armState = null;
        this.prevArmState = null;

        this.flightMode = null;
        this.prevFlightMode = null;
        this.flightModes = {
            MANUAL = 'MANUAL',
            STABILIZE = 'STABILIZE',
            DEPTH_HOLD = 'DEPTH_HOLD'
        }
    }

    start(poolInterval) {
        setInterval(this._possessInputs.bind(this), poolInterval);
    }

    keySmoothing(plusKey,minusKey,oldValue) {
        let newValue = oldValue;
        if (plusKey || minusKey) {

            if (plusKey) {
                newValue += this.gainPressed;
                if (newValue > 1) newValue = 1;

            } else if (minusKey) {
                newValue -= this.gainPressed;
                if (newValue < -1)  newValue = -1; 
            }
        } else {
            if (newValue > 0.06 || newValue < -0.06) {
                let sign = newValue/Math.abs(newValue);
                newValue -= sign*this.gainRelease;
            } else {
                newValue = 0;
            }
        }
        return newValue;
    }

    _possessInputs() {
        
        if (this._view.useGamePad() && this._gamePad.getGamepad() !== null) {
            var [axes, buttons] = this._gamePad.getGamepad();
            // Inputs that control the shuttle's movement
            this.y = axes[1];
            this.x = axes[0];
            this.z = axes[3];
            this.r = axes[2];

            // Arm or disarm the shuttle's motors
            let armButton = buttons[5].value;
            let disarmButton = buttons[4].value;
            if (armButton && !disarmButton) {
                this.armState = true;
            } else {
                this.armState = false;
            }

            // Change the shuttle's flight mode
            let manual = buttons[0].value;
            let stabilize = buttons[1].value;
            let depthHold = buttons[2].value;
            if (!manual && stabilize && !depthHold) {
                this.flightMode = this.flightModes.STABILIZE;
            } else if (!manual && !stabilize && depthHold) {
                this.flightMode = this.flightModes.DEPTH_HOLD
            } else {
                this.flightMode = this.flightModes.MANUAL;
            }

        } else if (this._view.useKeyboard()) {
            
            // y
            this.y = this.keySmoothing(this._keyboard.keyW(), this._keyboard.keyS(),this.y);

            // x
            this.x = this.keySmoothing(this._keyboard.keyD(), this._keyboard.keyA(),this.x);

            // z
            this.z = this.keySmoothing(this._keyboard.keyUp(), this._keyboard.keyDown(),this.z);

            // r
            this.r = this.keySmoothing(this._keyboard.keyRight(), this._keyboard.keyLeft(),this.r);
        }

        let inputMsg = {
            y: this.y,
            x: this.x,
            z: this.z,
            r: this.r
        }

        this._websocket.sendInput(inputMsg);
        this._view.setData(inputMsg);

        if (this.armState !== this.prevArmState) {
            this._websocket.sendShuttleCommand('armShuttle', this.armState);
            this.prevArmState = this.armState;
        }

        if (this.flightMode !== this.prevFlightMode) {
            this._websocket.sendShuttleCommand('changeFlightMode', this.flightMode);
        }
    }
}
