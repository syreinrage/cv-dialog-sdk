import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class SessionVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (!value) {
            throw new Error('SessionVisitor -- null value exception')
        }
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isSessionModel(this._enclosedJsonObject)) {
            throw new Error("Object passed to SessionVisitor is not a Session");
        }
    }

    // --- State Management Helpers --- //

    public static visitUserId(session: object): string {
        return (new SessionVisitor(session)).visitUserId();
    }

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.enclosedJsonObject());
    }

    public enclosedJsonObject() {
        return this._enclosedJsonObject;
    }

    // --- State Management --- //

    public propagateSessionId(sessionId: string) {
        this.enclosedJsonObject()['id'] = sessionId;
    }

    public visitId(): string {
        return this.enclosedJsonObject().id;
    }

    public visitTenantId(): string {
        return this.enclosedJsonObject().tenantId;
    }

    public visitUserId(): string {
        return this.enclosedJsonObject().userId;
    }

}
