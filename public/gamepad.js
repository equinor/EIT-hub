export default class GamePad {

    /** Gets the axis of the first gamepad connected 
     * 
     * @returns {[number]} An array of values between -1 and 1 for etch axis supposed by the controller.
     */
    getGamepad() {
        //TODO need to handle the case where there is no gamepad connected. This function should return something useful like an axes of only 0.0

        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        if (gamepads[0] !== null)
            return [gamepads[0].axes, gamepads[0].buttons];
        return null;
    }
}