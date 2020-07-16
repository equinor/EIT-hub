const uuid4 = require('uuid').v4;

class DeviceAuth {
    constructor(time) {
        this._time = time;
        this._keys = [];
    }

    /**
     * @param {string} deviceName
     */
    generateKey(deviceName) {
        const key = {
            name: deviceName,
            key: uuid4(),
            created: this._time.now()
        }

        this._keys.push(key);

        return key.key;
    }

    /**
     * @param {string} key
     * @param {string} deviceName
     * @returns {boolean}
     */
    checkKey(key, deviceName) {
        // We will check and clean at the same time.
        const newKeys = [];
        let isAllowed = false;
        const notBefore = this._time.now();
        notBefore.setSeconds(notBefore.getSeconds - 60);

        for (const keyObj of this._keys) {
            if(keyObj.created >= notBefore ) {
                newKeys.push[key];
            }
            if(keyObj.name === deviceName) {
                if(keyObj.key === key) {
                    isAllowed = true;
                }
            }
        }

        this._keys = newKeys;
        return isAllowed;
    }
}

module.exports = DeviceAuth;