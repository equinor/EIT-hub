/**
 * Util that allows me to get current time in a test safe manner.
 */
export default class Time{
    /// Set this property to overwrite the time for now. Only useful for testing.
    public nowOverride: Date | undefined = undefined;

    constructor(){}
    
    /** 
     * Returns the Date object for now. Or the override if its set.
     * 
     * @returns {Date}
     */
    now(): Date {
        if(this.nowOverride !== undefined) {
            return this.nowOverride;
        } else {
            return new Date();
        }
    }
}