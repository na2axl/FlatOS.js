+function($) {

    FlatOS.Api.User = function(callback, async) {
        if (typeof async === 'undefined') {
            async = true;
        }
        this.api = new FlatOS.Api.Call({
            call_async: async,
            api_class: 'User'
        }, callback);
    };

    FlatOS.Api.User.prototype.setUser = function(user) {
        this.api
            .setMethod('setUser')
            .setArguments([user])
            .call();
    };

    FlatOS.Api.User.prototype.getUsername = function() {
        this.api
            .setMethod('getUsername')
            .setArguments([])
            .call();
    };

    FlatOS.Api.User.prototype.getUserList = function() {
        this.api
            .setMethod('getUserList')
            .setArguments([])
            .call();
    };

    FlatOS.Api.User.prototype.isSession = function() {
        this.api
            .setMethod('isSession')
            .setArguments([])
            .call();
    };

    FlatOS.Api.User.prototype.getUserDirectory = function(dir) {
        this.api
            .setMethod('getUserDirectory')
            .setArguments([dir])
            .call();
    };

    FlatOS.Api.User.prototype.listUserDirectory = function(dir) {
        this.api
            .setMethod('listUserDirectory')
            .setArguments([dir])
            .call();
    };

    FlatOS.Api.User.prototype.setSessionValue = function(id, value) {
        this.api
            .setMethod('setSessionValue')
            .setArguments([id, value])
            .call();
    };

    FlatOS.Api.User.prototype.getSessionValue = function(id) {
        this.api
            .setMethod('getSessionValue')
            .setArguments([id])
            .call();
    };

    FlatOS.Api.User.prototype.getExternalUserPath = function(path, user) {
        this.api
            .setMethod('getExternalUserPath')
            .setArguments([path, user])
            .call();
    };

}(jQuery);