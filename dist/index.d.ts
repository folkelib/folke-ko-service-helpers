/// <reference types="knockout" />
import { SimpleApiClient } from "folke-service-helpers";
/** An object whose value may have changed since an initial value */
export interface Changeable {
    /** Whether the object value changed or not */
    changed: KnockoutComputed<boolean>;
}
/** Utility function that converts a string to a date and checks that the value is different
 * @param {Date} value The current value
 * @param {string} original The original value, that is converted to a Date
 */
export declare function hasDateChanged(value: Date, original: string): boolean;
/** Utility function that checks that an object has changed or that the object was originaly null but is not anymore, or that the
 * object is not null but originaly was null.
 */
export declare function hasObjectChanged<T extends Changeable, V>(value: T, original: V): boolean;
/** Checks if an array of Changeable has changed */
export declare function hasArrayOfObjectsChanged<T extends Changeable, V>(value: KnockoutObservableArray<T>, original: V[] | null): boolean;
/** Checks if an array of values has changed */
export declare function hasArrayChanged<T>(value: KnockoutObservableArray<T>, original: T[]): boolean;
export declare function toDate(date: string | null): Date | null;
export declare function fromDate(date: Date | null): string | null;
export declare class KnockoutApiClient extends SimpleApiClient {
    loading: KnockoutObservable<boolean>;
    constructor();
}
