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
import { SimpleApiClient } from "folke-service-helpers";

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
export function hasArrayOfObjectsChanged<T extends Changeable,V>(value: KnockoutObservableArray<T>, original: V[] | null) {
    if (!value())
        return original != null;
    if (original === null)
        return true;
    return value().length !== original.length || value().some(v => v.changed());
}

/** Checks if an array of values has changed */
export function hasArrayChanged<T>(value: KnockoutObservableArray<T>, original: T[]) {
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value().length != original.length || value().some((v, i) => v != original[i]);
}

export function toDate(date:string | null) {
    return date ? new Date(date) : null;
}

export function fromDate(date:Date | null) {
    return date ? date.toISOString() : null;
}

export class KnockoutApiClient extends SimpleApiClient {
    loading = ko.observable(false);

    constructor() {
        super({ onQueryStart: () => this.loading(true), onQueryEnd: () => this.loading(false) });
    }
}