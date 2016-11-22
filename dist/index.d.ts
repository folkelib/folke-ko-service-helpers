/// <reference types="knockout" />
/// <reference types="whatwg-fetch" />
export declare var errorMessages: {
    unauthorized: string;
    internalServerError: string;
    notFound: string;
    unknownError: string;
};
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
export declare function hasArrayOfObjectsChanged<T extends Changeable, V>(value: KnockoutObservableArray<T>, original: V[]): boolean;
/** Checks if an array of values has changed */
export declare function hasArrayChanged<T>(value: KnockoutObservableArray<T>, original: T[]): boolean;
/** Called each time there is an error message to show. You should replace
 * this with your own function.
 */
export declare var showError: (error: string) => void;
/** An error with the response that caused this error */
export declare class ResponseError extends Error {
    response: Response;
    constructor(message: string);
}
/** Creates a guery string from a list of parameters. Starts with a ? */
export declare function getQueryString(parameters?: {
    [key: string]: any;
}): string;
/** True if there is any loading in progress */
export declare var loading: KnockoutObservable<boolean>;
export declare type Data = ArrayBuffer | ArrayBufferView | Blob | FormData | string | undefined;
/** Fetches an url that returns nothing */
export declare function fetchVoid(url: string, method: string, data: Data): Promise<Response>;
/** Fetches an url that returns one value */
export declare function fetchSingle<TD>(url: string, method: string, data: Data): Promise<TD>;
/** Fetches an url that returns an array of values */
export declare function fetchList<TD>(url: string, method: string, data: Data): Promise<TD[]>;
/** Fetches an url that returns one value and apply a factory to it */
export declare function fetchSingleT<TD, TR>(url: string, method: string, factory: (data: TD) => TR, data: Data): Promise<TD>;
/** Fetches an url that returns an array of values and apply a factory on the response */
export declare function fetchListT<TD, TR>(url: string, method: string, factory: (data: TD) => TR, data: Data): Promise<TR[]>;
