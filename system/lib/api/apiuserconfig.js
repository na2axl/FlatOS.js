+function ($) {

    FlatOS.Api.UserConfig = function(callback, async) {
        if (typeof async === 'undefined') {
            async = true;
        }
        this.api = new FlatOS.Api.Call({
            call_async: async,
            api_class: 'UserConfig'
        }, callback);
    };

    FlatOS.Api.UserConfig.prototype.setConfig = function(file, index, value) {
        this.api
            .setMethod('setConfig')
            .setArguments([file, index, value])
            .call();
    };

    FlatOS.Api.UserConfig.prototype.getConfig = function(file, required, user) {
        this.api
            .setMethod('getConfig')
            .setArguments([file, required, user])
            .call();
    };

}(jQuery)