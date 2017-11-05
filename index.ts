/*Copyright (C) 2015 Sidoine De Wispelaere

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.*/

import * as ko from "knockout";

export var errorMessages = {
    unauthorized: "Unauthorized access",
    internalServerError: "Internal server error",
    notFound: "Resource not found",
    unknownError: "Unknown error"
}

/** An object whose value may have changed since an initial value */
export interface Changeable {
    /** Whether the object value changed or not */
    changed: KnockoutComputed<boolean>
}

/** Utility function that converts a string to a date and checks that the value is different
 * @param {Date} value The current value
 * @param {string} original The original value, that is converted to a Date
 */
export function hasDateChanged(value: Date, original: string) {
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value.getTime() != new Date(original).getTime();
}

/** Utility function that checks that an object has changed or that the object was originaly null but is not anymore, or that the
 * object is not null but originaly was null.
 */
export function hasObjectChanged<T extends Changeable, V>(value: T, original: V) {
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value.changed();
}

/** Checks if an array of Changeable has changed */
export function hasArrayOfObjectsChanged<T extends Changeable,V>(value: KnockoutObservableArray<T>, original: V[]) {
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value().length != original.length || value().some(v => v.changed());
}

/** Checks if an array of values has changed */
export function hasArrayChanged<T>(value: KnockoutObservableArray<T>, original: T[]) {
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value().length != original.length || value().some((v, i) => v != original[i]);
}

/** Called each time there is an error message to show. You should replace
 * this with your own function.
 */
export var showError = (error:string, field?:string) => console.error(error);

/** An error with the response that caused this error */
export class ResponseError extends Error {
    response: Response
    constructor(message:string) {
        super(message);
    }
}

interface MvcErrorMessages {
    errors: {
        errorMessage: string;
    }[]
}

interface MvcErrors {
    [key:string]: string[];
}

function hasErrorMessage(error: any): error is MvcErrorMessages {
    return error.errors !== undefined;
}

function parseErrors(error:ResponseError) {
    if (!error.response) {
        return showError(errorMessages.unknownError);
    }

    switch (error.response.status) {
        case 401:
            showError(errorMessages.unauthorized);
            break;
        case 404:
            showError(errorMessages.notFound);
            break;
        case 500:
            showError(errorMessages.internalServerError);
            break;
        default:
            if (!error.response.json) {
                showError(errorMessages.unknownError);
            }
            else {
                error.response.json().then((value:string|MvcErrors) => {
                    if (typeof value === "string") {
                        showError(value);
                    }
                    else {
                        for (let field in value) {
                            for (let error of value[field]){
                                showError(error, field);
                            }                            
                        }                        
                    } 
                });
            }
            break;
    }
}

/** Creates a guery string from a list of parameters. Starts with a ? */
export function getQueryString(parameters?: { [key: string]: any }) {
    var parametersList:string[] = [];

    if (parameters) {
        for (var key in parameters) {
            var value = parameters[key];
            if (value == undefined) continue;
            if (value instanceof Date)
                value = value.toISOString();
            parametersList.push(key + '=' + encodeURIComponent(value));
        }
    }
    var ret: string;

    if (parametersList.length > 0) {
        ret = '?' + parametersList.join('&');
    }
    else {
        ret = '';
    }
    return ret;
}

/** True if there is any loading in progress */
export var loading = ko.observable(false);

export type Data = ArrayBuffer | ArrayBufferView | Blob | FormData | string | undefined;

/** A private method called by the fetch methods. Creates a ResponseError
 * if the response has a status code that is not in the 200-300 range and
 * sets/unsets the loading boolean.
 */
function fetchCommon(url: string, method: string, data: Data): Promise<Response> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append('Content-Type', 'application/json');
    var requestInit: RequestInit = {
        method: method,
        credentials: 'same-origin',
        headers: headers
    };
    loading(true);
    if (data != undefined) requestInit.body = data;
    return window.fetch(url, requestInit).then(response => {
        loading(false);
        if (response.status >= 300 || response.status < 200) {
            var error = new ResponseError(response.statusText);
            error.response = response;
            parseErrors(error);
            throw error;
        }
        return response;
    }, (error:ResponseError) => {
        loading(false);
        parseErrors(error);
        throw error;
    });
}

/** Fetches an url that returns nothing */
export function fetchVoid(url: string, method: string, data: Data) {
    return fetchCommon(url, method, data);
}

/** Fetches an url that returns one value */
export function fetchSingle<TD>(url: string, method: string, data: Data) {
    return fetchCommon(url, method, data).then(response => <Promise<TD>>response.json());
}

/** Fetches an url that returns an array of values */
export function fetchList<TD>(url: string, method: string, data: Data) {
    return fetchCommon(url, method, data).then(response => <Promise<TD[]>>response.json());
}

/** Fetches an url that returns one value and apply a factory to it */
export function fetchSingleT<TD, TR>(url: string, method: string, factory: (data: TD) => TR, data: Data) {
    return fetchCommon(url, method, data).then(response => <Promise<TD>>response.json()).then(result => factory(result));
}

/** Fetches an url that returns an array of values and apply a factory on the response */
export function fetchListT<TD, TR>(url: string, method: string, factory: (data: TD) => TR, data: Data) {
    return fetchCommon(url, method, data).then(response =>(<Promise<TD[]>>response.json())).then(result => result.map(item => factory(item)));
}
