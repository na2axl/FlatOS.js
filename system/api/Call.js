// Loading the Kernel
const FlatOS = require('../kernel/Kernel');

var Call = function () {};

/**
 * Call an API
 *
 * @param {String} className
 * @param {String} method
 * @param {String} argument
 *
 * @throws Error
 *
 * @return {*}
 */
Call.prototype.call = function (className, method, argument) {
    className = className || null;
    method = method || null;
    argument = argument || null;

    if (className === null || className.length == 0) {
        throw new Error("Cannot call an API without a class name");
    }

    var API = FlatOS.load(className);

    return API[method].apply(API, argument);
};

// Exports the module
module.exports = new Call();
