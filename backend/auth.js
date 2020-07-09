/** A class that handles authentication and access controls needs for EitHub
 *  Must be integrated with express to generate any security.
 */
class Auth {
    /** Create and setup a new Auth module from config.
     * 
     * @param {*} config Config object from config module.
     */
    constructor(config) {

    }

    /** Generates a new token that devices to connect device endpoints.
     * 
     * The token is only valid for 60 seconds. So the device must complete the connection within that time.
     * 
     * @returns {string} A HTTP bearer token.
     */
    getDeviceToken() {
        // TODO Return a securely generated random string.
        return "";
    }

    /** Express middleware to be used for device endpoints.
     * @returns Express Middleware
     */
    getDeviceMiddleware() {
        // TODO Write a middleware that do not just accept all.

        return function(_req, _res, next) {
            console.log("Device Auth not implemented. Accepting request.");
            next();
        }
    }
    
    /** Express middleware to be used for browser endpoints.
     * @returns Express Middleware
     */
    getBrowserMiddleware() {
        // TODO Current version accept everything.

        return function(_req, _res, next) {
            console.log("Browser auth not implemented. Accepting request.");
            next();
        }
    }
}


module.exports = Auth;