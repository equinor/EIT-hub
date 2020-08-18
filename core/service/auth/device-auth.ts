import Time from "../utils/time";
import {v4 as uuid4} from "uuid";

interface KeyObj {
    name: string,
    key: string,
    created: Date
}

export default class DeviceAuth {
    private _keys: KeyObj[] = [];

    constructor(private _time: Time) {
    }

    /**
     * @param {string} deviceName
     */
    generateKey(deviceName: string): string {
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
    checkKey(key: string, deviceName: string): boolean {
        // We will check and clean at the same time.
        const newKeys:KeyObj[] = [];
        let isAllowed = false;
        const notBefore = this._time.now();
        notBefore.setSeconds(notBefore.getSeconds() - 60);

        for (const keyObj of this._keys) {
            if(keyObj.created >= notBefore ) {
                newKeys.push(keyObj);
                if(keyObj.name === deviceName) {
                    if(keyObj.key === key) {
                        isAllowed = true;
                    }
                }
            }
        }

        this._keys = newKeys;
        return isAllowed;
    }
}

module.exports = DeviceAuth;