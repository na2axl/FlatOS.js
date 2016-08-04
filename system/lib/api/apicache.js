+function ($) {

    FlatOS.Api.Cache = function (callback, async) {
        if (typeof async === 'undefined') {
            async = true;
        }
        this.api = new FlatOS.Api.Call({
            call_async: async,
            api_class: 'Cache'
        }, callback);
    };

    // TODO: Implement Me !!!

    FlatOS.Api.Cache.prototype.createCacheFile = function (affixes) {
        this.api
            .setMethod('createCacheFile')
            .setArguments([affixes])
            .call();
    };

    FlatOS.Api.Cache.prototype.getCacheData = function (path, index) {
        this.api
            .setMethod('getCacheData')
            .setArguments([path, index])
            .call();
    };

}(jQuery);