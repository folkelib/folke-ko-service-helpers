"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ko = require("knockout");
var folke_service_helpers_1 = require("folke-service-helpers");
/** Utility function that converts a string to a date and checks that the value is different
 * @param {Date} value The current value
 * @param {string} original The original value, that is converted to a Date
 */
function hasDateChanged(value, original) {
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value.getTime() != new Date(original).getTime();
}
exports.hasDateChanged = hasDateChanged;
/** Utility function that checks that an object has changed or that the object was originaly null but is not anymore, or that the
 * object is not null but originaly was null.
 */
function hasObjectChanged(value, original) {
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value.changed();
}
exports.hasObjectChanged = hasObjectChanged;
/** Checks if an array of Changeable has changed */
function hasArrayOfObjectsChanged(value, original) {
    if (!value())
        return original != null;
    if (original === null)
        return true;
    return value().length !== original.length || value().some(function (v) { return v.changed(); });
}
exports.hasArrayOfObjectsChanged = hasArrayOfObjectsChanged;
/** Checks if an array of values has changed */
function hasArrayChanged(value, original) {
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value().length != original.length || value().some(function (v, i) { return v != original[i]; });
}
exports.hasArrayChanged = hasArrayChanged;
function toDate(date) {
    return date ? new Date(date) : null;
}
exports.toDate = toDate;
function fromDate(date) {
    return date ? date.toISOString() : null;
}
exports.fromDate = fromDate;
var KnockoutApiClient = /** @class */ (function (_super) {
    __extends(KnockoutApiClient, _super);
    function KnockoutApiClient() {
        var _this = _super.call(this, { onQueryStart: function () { return _this.loading(true); }, onQueryEnd: function () { return _this.loading(false); } }) || this;
        _this.loading = ko.observable(false);
        return _this;
    }
    return KnockoutApiClient;
}(folke_service_helpers_1.SimpleApiClient));
exports.KnockoutApiClient = KnockoutApiClient;
