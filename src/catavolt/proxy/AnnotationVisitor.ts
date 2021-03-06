import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class AnnotationVisitor implements JsonObjectVisitor{

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (!value) {
            throw new Error('AnnotationVisitor -- null value exception')
        }
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isAnnotationModel(this._enclosedJsonObject)) {
            throw new Error("Object passed to AnnotationVisitor is not an Annotation");
        }
    }

    // --- State Management Helpers --- //

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

}
