import moment from 'moment';
import { DateTimeValue } from '../util/DateTimeValue';
import { DateValue } from '../util/DateValue';
import { StringDictionary } from '../util/StringDictionary';
import { TimeValue } from '../util/TimeValue';
import { CodeRef } from './CodeRef';
import { DataAnnotation } from './DataAnnotation';
import { GpsReading } from './GpsReading';
import { MapLocation } from './MapLocation';
import { ObjectRef } from './ObjectRef';
import { PropertyDef } from './PropertyDef';
import { TypeNames } from './types';

/**
 * Represents a 'value' or field in a row or record. See {@link Record}
 * A Prop has a corresponding {@link PropertyDef} that describes the property.
 * Like an {@link Record}, a Prop may also have {@link Annotation}s (style annotations),
 * but these apply to the property only
 */
export class Property {
    /**
     * Produce an unique string that can be used for comparison purposes
     * Props considered 'equal' should produce the same identity string
     *
     * @param o
     * @param {PropertyDef} propDef
     * @returns {string}
     */
    public static identity(o: any, propDef: PropertyDef): string {
        if (typeof o === 'number') {
            return String(o);
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                return String(o.getTime());
            } else if (o instanceof DateValue) {
                return String((o as DateValue).dateObj.getTime());
            } else if (o instanceof DateTimeValue) {
                return String((o as DateTimeValue).dateObj.getTime());
            } else if (o instanceof TimeValue) {
                return o.toString();
            } else if (o instanceof CodeRef) {
                return (o as CodeRef).code;
            } else if (o instanceof ObjectRef) {
                return (o as ObjectRef).objectId;
            } else if (o instanceof GpsReading) {
                return o.toString();
            } else if (o instanceof MapLocation) {
                return o.toString();
            } else {
                return String(o);
            }
        } else {
            return String(o);
        }
    }

    public static fromJSON(jsonObject: StringDictionary): Property {
        return new Property(
            jsonObject.name,
            Property.parseJSONValue(jsonObject.value, jsonObject.format),
            jsonObject.propertyType,
            jsonObject.format,
            jsonObject.annotations
        );
    }

    /**
     *
     * @param {string} name
     * @param value
     * @param {string} propertyType
     * @param {string} format
     * @param {Array<DataAnnotation>} annotations
     */
    constructor(
        readonly name: string,
        readonly value: any,
        readonly propertyType?: string,
        readonly format?: string,
        readonly annotations: DataAnnotation[] = []
    ) {}

    public equals(prop: Property): boolean {
        return this.name === prop.name && this.value === prop.value;
    }

    get backgroundColor(): string {
        return DataAnnotation.backgroundColor(this.annotations);
    }

    get foregroundColor(): string {
        return DataAnnotation.foregroundColor(this.annotations);
    }

    get imageName(): string {
        return DataAnnotation.imageName(this.annotations);
    }

    get imagePlacement(): string {
        return DataAnnotation.imagePlacement(this.annotations);
    }

    get isBoldText(): boolean {
        return DataAnnotation.isBoldText(this.annotations);
    }

    get isItalicText(): boolean {
        return DataAnnotation.isItalicText(this.annotations);
    }

    get isPlacementCenter(): boolean {
        return DataAnnotation.isPlacementCenter(this.annotations);
    }

    get isPlacementLeft(): boolean {
        return DataAnnotation.isPlacementLeft(this.annotations);
    }

    get isPlacementRight(): boolean {
        return DataAnnotation.isPlacementRight(this.annotations);
    }

    get isPlacementStretchUnder(): boolean {
        return DataAnnotation.isPlacementStretchUnder(this.annotations);
    }

    get isPlacementUnder(): boolean {
        return DataAnnotation.isPlacementUnder(this.annotations);
    }

    get isUnderline(): boolean {
        return DataAnnotation.isUnderlineText(this.annotations);
    }

    get overrideText(): string {
        return DataAnnotation.overrideText(this.annotations);
    }

    get tipText(): string {
        return DataAnnotation.tipText(this.annotations);
    }

    get valueForWrite() {
        const o = this.value;
        if (typeof o === 'number') {
            return String(o);
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                // remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
                return o.toISOString().slice(0, -1);
            } else if (o instanceof DateTimeValue) {
                // remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
                return o.dateObj.toISOString().slice(0, -1);
            } else if (o instanceof DateValue) {
                // remove all Time information from the end of the ISO string from the 'T' to the end...
                const isoString = o.dateObj.toISOString();
                return isoString.slice(0, isoString.indexOf('T'));
            } else if (o instanceof TimeValue) {
                return o.toString();
            } else {
                // for any other type of value, return the object itself
                // this could include string, Array, CodeRef, ObjectRef, GpsReadingProperty, MapLocationProperty, InlineBinaryRef
                return o;
            }
        } else {
            return o;
        }
    }

    public toJSON() {
        const jsonObject = {
            name: this.name,
            value: this.valueForWrite,
            type: TypeNames.PropertyTypeName,
            propertyType: null,
            format: null
        };
        if (this.propertyType) {
            jsonObject.propertyType = this.propertyType;
        }
        if (this.format) {
            jsonObject.format = this.format;
        }

        return jsonObject;
    }

    private static parseJSONValue(value: any, format: string): any {
        if (typeof value === 'string' && format) {
            if (
                ['integer', 'decimal', 'int32', 'int64', 'float', 'double'].some(v => format === v)
            ) {
                return Number(value);
            } else if (format === 'date') {
                // parse as ISO - no offset specified by server right now, so we assume local time
                return moment(value, 'YYYY-M-D').toDate();
            } else if (format === 'date-time') {
                // parse as ISO - no offset specified by server right now, so we assume local time
                // strip invalid suffix (sometimes) provided by server
                const i = value.indexOf('T0:');
                return moment(i > -1 ? value.substring(0, i) : value).toDate();
            } else if (format === 'time') {
                TimeValue.fromString(value);
            } else {
                return value;
            }
        } else {
            return value;
        }
    }
}