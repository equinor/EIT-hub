const DeviceAuth = require("./auth/device-auth");
const Time = require("./utils/time");
const UserAuth = require("./auth/user-auth");

/** A class that handles authentication and access controls needs for EitHub
 *  Must be integrated with express to generate any security.
 */
class Auth {
    /** Create and setup a new Auth module from config.
     * 
     * @param {*} config Config object from config module.
     */
    constructor(config) {
        this._baseUrl = config.baseUrl;
        this._disableDeviceAuth = config.disableDeviceAuth;
        this._deviceAuth = new DeviceAuth(new Time());
        this._userAuth = new UserAuth();
    }

    /** Generates a new token that devices to connect device endpoints.
     * 
     * The token is only valid for 60 seconds. So the device must complete the connection within that time.
     * 
     * @param {string} deviceName The name of the device you want to create a token for.
     * @returns {{url: URL, token: string, authorization: string}} An object with the information needed to connect:
     * * url is the url the device need to open a websocket against.
     * * token is the bearer token you need to authenticate with.
     * * authorization is the content of the Authorization http header you must have to connect. 
     */
    getDeviceToken(deviceName) {
        let key = this._deviceAuth.generateKey(deviceName);
        let url = new URL(`/device/${deviceName}`, this._baseUrl);

        if (this._baseUrl.protocol === "http:") {
            url.protocol = "ws"
        } else {
            url.protocol = "wss"
        }
        return {
            url: url,
            token: key,
            authorization: `Bearer ${key}`
        }
    }

    validateDeviceRequest(deviceName, request) {
        if(this._disableDeviceAuth === true) {
            // Auth is disabled.
            return true;
        }

        var authorization = request.headers.authorization;
        if(authorization) {
            const auth = authorization.split(" ");
            if(auth[0] !== "Bearer"){
                return false
            }
            return this._deviceAuth.checkKey(auth[1], deviceName);
        }

        return false;
    }

    /** Express middleware to be used for browser endpoints.
     * @returns Express Middleware
     */
    getBrowserMiddleware() {
        const self = this;

        return function (req, res, next) {
            let sessionId;
            if (self._userAuth.hasSession(req.cookies["session"])){
                sessionId = req.cookies["session"];
            } else {
                // first time we have seen this user.
                sessionId = self._userAuth.getNewSessionId();
                res.cookie("session",sessionId);
            }

            if( self._userAuth.getUser() !== null) {
                // we have user.
                next();
            }
            
        }
    }
}


module.exports = Auth;