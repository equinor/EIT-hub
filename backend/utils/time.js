/**
 * Util that allows me to get current time in a test safe manner.
 */
class Time{
    constructor(){
        /** 
         * Set this property to overwrite the time for now. Only useful for testing.
         *  
         * @type {Date?} 
         */
        this.nowOverride = undefined;
    }
    
    /** 
     * Returns the Date object for now. Or the override if its set.
     * 
     * @returns {Date}
     */
    now() {
        if(this.nowOverride !== undefined) {
            return this.nowOverride;
        } else {
            return new Date();
        }
    }
}

module.exports = Time;