export default class GamePad {

    /** Gets the axis of the first gamepad connected 
     * 
     * @returns {[number]} An array of values between -1 and 1 for etch axis supposed by the controller.
     */
    getAxes() {
        //TODO need to handle the case where there is no gamepad connected. This function should return something useful like an axes of only 0.0

        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        return gamepads[0].axes;
    }
}