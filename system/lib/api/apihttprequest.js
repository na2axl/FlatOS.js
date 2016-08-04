+function ($) {

    FlatOS.Api.HTTPRequest = function(callback, async) {
        if (typeof async === 'undefined') {
            async = true;
        }
        this.api = new FlatOS.Api.Call({
            call_async: async,
            api_class: 'HTTPRequest'
        }, callback);
    };

    FlatOS.Api.HTTPRequest.prototype.load = function(url, callback) {
        this.api
            .setMethod('load')
            .setArguments([url, callback.toString()])
            .call();
    };

}(jQuery)