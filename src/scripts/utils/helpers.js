/**
 * @description Internal helper to check if parameter is an object
 * @function isObject
 * @param {*} obj
 * @returns {boolean}
 */
var isObject = function(obj) {
    if (isArray(obj) || isDate(obj)) return false;
    return (obj !== null && typeof obj === 'object');
};

/**
 * @description Internal helper to check if parameter is a string
 * @function isString
 * @param {*} str
 * @returns {boolean}
 */
var isString = function(str) {
    return (typeof str === 'string' || str instanceof String);
};

/**
 * @description Internal helper to check if parameter is a date
 * @function isDate
 * @param {*} date
 * @returns {boolean}
 */
var isDate = function(date) {
    if (isString(date) || isArray(date) || date == undefined || date == null) return false;
    return (date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date));
};

/**
 * @description Internal helper to check if parameter is an array
 * @function isArray
 * @param {*} arr
 * @returns {boolean}
 */
var isArray = function(arr) {
    return Array.isArray(arr);
};

/**
 * @description Internal helper to check if DOMContentLoaded
 * @function ready
 * @param {Function} fn
 */
function ready(fn) {
    var d = document;
    (d.readyState == 'loading') ? d.addEventListener('DOMContentLoaded', fn): fn();
};

/**
 * @description Internal helper to get value from query string
 * @function getQueryStringValue
 * @param {String} key
 * @returns {String|null}
 */
function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
