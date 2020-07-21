const uuid4 = require('uuid').v4;

class UserAuth{
    constructor() {
        this._session = new Map();
    }

    getNewSessionId() {
        const session = uuid4();
        this._session.set(session, null);
        return session
    }

    hasSession(sessionId) {
        return this._session.has(sessionId);
    }
}

module.exports = UserAuth;