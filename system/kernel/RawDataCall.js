// Loading the Kernel
const FlatOS = require('./Kernel');

/**
 * RawDataCall
 *
 * Getting file as raw data.
 *
 * @author     Axel Nana
 * @package    FlatOS
 * @subpackage System
 * @constructor
 */
var RawDataCall = function () {};

RawDataCall.prototype.render = function (request, response) {
    var path = require('url').parse(request.originalUrl).pathname.split('%20').join(' ');

    var mime = FlatOS.load('FS').mimetype("."+path);
    var ctnt = FlatOS.load('FS').read("."+path, true);

    response.status(200).append("content-type", mime+";charset=utf-8");
    response.end(ctnt, FlatOS.load('FS').isBinary(path) ? "binary" : void 0);
};

// Exports the module
module.exports = new RawDataCall();