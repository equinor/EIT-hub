import {v4 as uuid4} from "uuid";

/* istanbul ignore file */
export default class UserAuth{
    private _session: Map<string, any> = new Map();

    getNewSessionId():string {
        const session = uuid4();
        this._session.set(session, null);
        return session
    }

    hasSession(sessionId:string):boolean {
        return this._session.has(sessionId);
    }

    getUser(sessionId:string):any {
        return this._session.get(sessionId);
    }

    setUser(sessionId:string, user:any):void {
        this._session.set(sessionId, user);
    }
}