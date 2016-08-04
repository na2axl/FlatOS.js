+function ($) {

    FlatOS.Api.File = function (callback, async) {
        if (typeof async === 'undefined') {
            async = true;
        }
        this.api = new FlatOS.Api.Call({
            call_async: async,
            api_class: 'File'
        }, callback);
    };

    FlatOS.Api.File.prototype.openDir = function (path) {
        this.api
            .setMethod('openDir')
            .setArguments([path])
            .call();
    };

    FlatOS.Api.File.prototype.openFile = function (path) {
        this.api
            .setMethod('openFile')
            .setArguments([path])
            .call();
    };

    FlatOS.Api.File.prototype.open = function (path) {
        this.api
            .setMethod('open')
            .setArguments([path])
            .call();
    };

    FlatOS.Api.File.prototype.save = function (path, contents, append) {
        this.api
            .setMethod('save')
            .setArguments([path, contents, append])
            .call();
    };

}(jQuery);
