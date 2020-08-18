import {v4 as uuid4} from "uuid";

export default class UserAuth{
    private _session: Map<string, any> = new Map();
    constructor() {
    }

    getNewSessionId() {
        const session = uuid4();
        this._session.set(session, null);
        return session
    }

    hasSession(sessionId:string) {
        return this._session.has(sessionId);
    }

    getUser(sessionId:string) {
        return this._session.get(sessionId);
    }

    setUser(sessionId:string, user:any) {
        this._session.set(sessionId, user);
    }
}