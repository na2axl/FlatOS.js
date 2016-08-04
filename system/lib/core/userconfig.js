+function ($) {

    FlatOS.System.UserConfig = function(user) {
        this.user = user || new FlatOS.System.User().username();
    };

    FlatOS.System.UserConfig.prototype.setConfig = function(file, index, value) {
        var result;
        user = user || this.user;
        new FlatOS.Api.UserConfig(function(r) {
            result = r;
        }, false).setConfig(file, index, value);
        return result;
    };

    FlatOS.System.UserConfig.prototype.getConfig = function(file, required, user) {
        var result;
        user = user || this.user;
        new FlatOS.Api.UserConfig(function(r) {
            result = r;
        }, false).getConfig(file, required, user);
        return result;
    };

}(jQuery);