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
exports.errorMessages = {
    unauthorized: "Unauthorized access",
    internalServerError: "Internal server error",
    notFound: "Resource not found",
    unknownError: "Unknown error"
};
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
    if (value == null)
        return original != null;
    if (original == null)
        return true;
    return value().length != original.length || value().some(function (v) { return v.changed(); });
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
/** Called each time there is an error message to show. You should replace
 * this with your own function.
 */
exports.showError = function (error, field) { return console.error(error); };
/** An error with the response that caused this error */
var ResponseError = /** @class */ (function (_super) {
    __extends(ResponseError, _super);
    function ResponseError(message) {
        return _super.call(this, message) || this;
    }
    return ResponseError;
}(Error));
exports.ResponseError = ResponseError;
function hasErrorMessage(error) {
    return error.errors !== undefined;
}
function parseErrors(error) {
    if (!error.response) {
        return exports.showError(exports.errorMessages.unknownError);
    }
    switch (error.response.status) {
        case 401:
            exports.showError(exports.errorMessages.unauthorized);
            break;
        case 404:
            exports.showError(exports.errorMessages.notFound);
            break;
        case 500:
            exports.showError(exports.errorMessages.internalServerError);
            break;
        default:
            if (!error.response.json) {
                exports.showError(exports.errorMessages.unknownError);
            }
            else {
                error.response.json().then(function (value) {
                    if (typeof value === "string") {
                        exports.showError(value);
                    }
                    else {
                        for (var field in value) {
                            for (var _i = 0, _a = value[field]; _i < _a.length; _i++) {
                                var error_1 = _a[_i];
                                exports.showError(error_1, field);
                            }
                        }
                    }
                });
            }
            break;
    }
}
/** Creates a guery string from a list of parameters. Starts with a ? */
function getQueryString(parameters) {
    var parametersList = [];
    if (parameters) {
        for (var key in parameters) {
            var value = parameters[key];
            if (value == undefined)
                continue;
            if (value instanceof Date)
                value = value.toISOString();
            parametersList.push(key + '=' + encodeURIComponent(value));
        }
    }
    var ret;
    if (parametersList.length > 0) {
        ret = '?' + parametersList.join('&');
    }
    else {
        ret = '';
    }
    return ret;
}
exports.getQueryString = getQueryString;
/** True if there is any loading in progress */
exports.loading = ko.observable(false);
/** A private method called by the fetch methods. Creates a ResponseError
 * if the response has a status code that is not in the 200-300 range and
 * sets/unsets the loading boolean.
 */
function fetchCommon(url, method, data) {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append('Content-Type', 'application/json');
    var requestInit = {
        method: method,
        credentials: 'same-origin',
        headers: headers
    };
    exports.loading(true);
    if (data != undefined)
        requestInit.body = data;
    return window.fetch(url, requestInit).then(function (response) {
        exports.loading(false);
        if (response.status >= 300 || response.status < 200) {
            var error = new ResponseError(response.statusText);
            error.response = response;
            parseErrors(error);
            throw error;
        }
        return response;
    }, function (error) {
        exports.loading(false);
        parseErrors(error);
        throw error;
    });
}
/** Fetches an url that returns nothing */
function fetchVoid(url, method, data) {
    return fetchCommon(url, method, data);
}
exports.fetchVoid = fetchVoid;
/** Fetches an url that returns one value */
function fetchSingle(url, method, data) {
    return fetchCommon(url, method, data).then(function (response) { return response.json(); });
}
exports.fetchSingle = fetchSingle;
/** Fetches an url that returns an array of values */
function fetchList(url, method, data) {
    return fetchCommon(url, method, data).then(function (response) { return response.json(); });
}
exports.fetchList = fetchList;
/** Fetches an url that returns one value and apply a factory to it */
function fetchSingleT(url, method, factory, data) {
    return fetchCommon(url, method, data).then(function (response) { return response.json(); }).then(function (result) { return factory(result); });
}
exports.fetchSingleT = fetchSingleT;
/** Fetches an url that returns an array of values and apply a factory on the response */
function fetchListT(url, method, factory, data) {
    return fetchCommon(url, method, data).then(function (response) { return response.json(); }).then(function (result) { return result.map(function (item) { return factory(item); }); });
}
exports.fetchListT = fetchListT;
