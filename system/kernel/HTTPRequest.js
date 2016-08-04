// Loading the Kernel
const FlatOS = require('./Kernel');

/**
 * HTTPRequest
 *
 * Manager for the File Selector and the
 * File Saver system applications.
 *
 * @author      Axel Nana
 * @package     FlatOS
 * @subpackage  System
 * @constructor
 */
var HTTPRequest = function () {
    this.GET = {};
    this.POST = {};
};

/**
 * Sets the value of the GET global var
 *
 * @param {object} GET
 */
HTTPRequest.prototype.setGET = function (GET) {
    this.GET = GET;
};

/**
 * Sets the value of the POST global var
 *
 * @param {object} POST
 */
HTTPRequest.prototype.setPOST = function (POST) {
    this.POST = POST;
};

HTTPRequest.prototype.load = function (url, callback) {
    require('request')(url, function (error, response, body) {
        if (typeof callback.valueOf() === 'string') {
            callback = eval("(" + callback + ")");
        }
        callback(error, response, body);
    });
};

// Exports the module
module.exports = new HTTPRequest();
