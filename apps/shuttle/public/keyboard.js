export default class Keyboard {
    constructor(window) { 
        window.addEventListener("keydown", this._down.bind(this), false);
        window.addEventListener("keyup", this._up.bind(this), false);
        window.addEventListener("keydown", function(e) {
            // Prevent page from moving upon arrow key press
            if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

        /** A map of keyCode to pressed state. */
        this._pressed = {};
    }

    isPressed(keycode) { 
        // return true only if keycode have a value of true and type bool. If the value is not there is false.
        return this._pressed[keycode] === true;
    }

    keyD() {return this.isPressed(68)}
    keyS() {return this.isPressed(83)}
    keyA() {return this.isPressed(65)}
    keyW() {return this.isPressed(87)}
    keyLeft() {return this.isPressed(37)}
    keyUp() {return this.isPressed(38)}
    keyRight() {return this.isPressed(39)}
    keyDown() {return this.isPressed(40)}
    key1() {return this.isPressed(49)}
    key2() {return this.isPressed(50)}
    key3() {return this.isPressed(51)}

    _down(event){
        this._pressed[event.keyCode] = true;
    }

    _up(event){
        this._pressed[event.keyCode] = false;
    } 
}