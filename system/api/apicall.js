// Loading the Kernel
const FlatOS = require('../kernel/Kernel');

/**
 * Returns the result of an API call
 *
 * @return {object}
 */
// Exports the API
module.exports.result = function () {
    var api           = null;
    var json          = null;
    var api_class     = FlatOS.load('HTTPRequest').POST['api_class'] || null;
    var api_method    = FlatOS.load('HTTPRequest').POST['api_method'] || null;
    var api_arguments = FlatOS.load('HTTPRequest').POST['api_arguments'] || {};

    if (api_class !== null) {
        api = require('./Call');
    }

    if (api !== null) {
        try {
            json = {'err': false, 'err_msg': '', 'err_stack': '', 'res': api.call(api_class, api_method, api_arguments)};
        }
        catch (e) {
            json = {'err': true, 'err_msg': e.message, 'err_stack': e.stack, 'res': ''};
        }
    }
    else {
        json = {'err': true, 'err_msg': "An unexpected error occurred while calling the API. Maybe the API \""+api_class+"\" doesn't exists.", 'err_stack': '', 'res': ''};
    }

    return json;
};