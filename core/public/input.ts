import WebSocket from "./websocket";
import Gamepad from "./gamepad";
import Keyboard from "./keyboard";
import InputView from "./inputView";

export default class Input{
    private gainPressed = 0.15;
    private gainRelease = 0.2;
    private x = 0;
    private y = 0;
    private z = 0;
    private r = 0;
    private armState: boolean | null = null;
    private prevArmState: boolean | null = null;
    private flightMode: string | null = null;
    private prevFlightMode: string | null = null;
    private flightModes: { MANUAL: string; STABILIZE: string; DEPTH_HOLD: string; } = {
        MANUAL: 'MANUAL',
        STABILIZE: 'STABILIZE',
        DEPTH_HOLD: 'ALT_HOLD'
    };

    constructor(private websocket: WebSocket, private gamePad: Gamepad, private keyboard: Keyboard, private view: InputView) {
    }

    start(poolInterval: number):void {
        setInterval(this._possessInputs.bind(this), poolInterval);
    }

    keySmoothing(plusKey: boolean,minusKey: boolean,oldValue: number): number {
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
                const sign = newValue/Math.abs(newValue);
                newValue -= sign*this.gainRelease;
            } else {
                newValue = 0;
            }
        }
        return newValue;
    }

    _possessInputs():void {
        
        if (this.view.useGamePad() && this.gamePad.getGamepad() !== null) {
            const [axes, buttons] = this.gamePad.getGamepad()!;
            // Inputs that control the shuttle's movement
            this.y = -axes[1];
            this.x = axes[0];
            this.z = -axes[3];
            this.r = axes[2];

            // Arm or disarm the shuttle's motors
            const armButton = buttons[9].value;
            const disarmButton = buttons[8].value;
            if (armButton && !disarmButton) {
                this.armState = true;
            } else if (!armButton && disarmButton) {
                this.armState = false;
            }

            // Change the shuttle's flight mode
            const manual = buttons[0].value;
            const stabilize = buttons[1].value;
            const depthHold = buttons[2].value;
            if (!manual && stabilize && !depthHold) {
                this.flightMode = this.flightModes.STABILIZE;
            } else if (!manual && !stabilize && depthHold) {
                this.flightMode = this.flightModes.DEPTH_HOLD
            } else if (manual && !stabilize && !depthHold) {
                this.flightMode = this.flightModes.MANUAL;
            }

            this.view.updateGamepadImage(this.x,this.y,this.z,this.r,armButton,disarmButton,manual,stabilize,depthHold);

        } else if (this.view.useKeyboard()) {
            
            // y
            this.y = this.keySmoothing(this.keyboard.keyW(), this.keyboard.keyS(),this.y);

            // x
            this.x = this.keySmoothing(this.keyboard.keyD(), this.keyboard.keyA(),this.x);

            // z
            this.z = this.keySmoothing(this.keyboard.keyUp(), this.keyboard.keyDown(),this.z);

            // r
            this.r = this.keySmoothing(this.keyboard.keyRight(), this.keyboard.keyLeft(),this.r);

            const manual = this.keyboard.key1();
            const stabilize = this.keyboard.key2();
            const depthHold = this.keyboard.key3();
            if (!manual && stabilize && !depthHold) {
                this.flightMode = this.flightModes.STABILIZE;
            } else if (!manual && !stabilize && depthHold) {
                this.flightMode = this.flightModes.DEPTH_HOLD
            } else if (manual && !stabilize && !depthHold) {
                this.flightMode = this.flightModes.MANUAL;
            }
        }

        const inputMsg = {
            y: this.y,
            x: this.x,
            z: this.z,
            r: this.r
        }

        this.websocket.sendInput(inputMsg);
        this.view.setData(inputMsg);

        if (this.armState !== this.prevArmState) {
            this.websocket.sendShuttleCommand('armShuttle', this.armState);
            this.prevArmState = this.armState;
        }

        if (this.flightMode !== this.prevFlightMode) {
            this.websocket.sendShuttleCommand('changeFlightMode', this.flightMode);
            this.prevFlightMode = this.flightMode;
        }
    }
}