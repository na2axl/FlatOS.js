+function($) {

    FlatOS.System.User = function (user) {
        this.user = user;
    };

    FlatOS.System.User.prototype.username = function() {
        var result;
        if (typeof this.user === 'undefined') {
            new FlatOS.Api.User(function(r) {
                result = r;
            }, false).getUsername();
        }
        else {
            result = this.user;
        }
        return result;
    };

    FlatOS.System.User.prototype.setUser = function(user) {
        new FlatOS.Api.User(null, false).setUser(user);
    };

    FlatOS.System.User.prototype.userDir = function(dir) {
        var result;
        new FlatOS.Api.User(function(r) {
            result = r;
        }, false).getUserDirectory(dir);
        return result;
    };

    FlatOS.System.User.prototype.listUserDirectory = function(dir) {
        var result;
        new FlatOS.Api.User(function(r) {
            result = r;
        }, false).listUserDirectory(dir);
        return result;
    };

    FlatOS.System.User.prototype.isSession = function() {
        var result;
        new FlatOS.Api.User(function(r) {
            result = r;
        }, false).isSession();
        return result;
    };

    FlatOS.System.User.prototype.userList = function() {
        var result;
        new FlatOS.Api.User(function(r) {
            result = r;
        }, false).getUserList();
        return result;
    };

    FlatOS.System.User.prototype.setSessionValue = function(id, value) {
        new FlatOS.Api.User(null, false).setSessionValue(id, value);
    };

    FlatOS.System.User.prototype.getSessionValue = function(id) {
        var result;
        new FlatOS.Api.User(function(r) {
            result = r;
        }, false).getSessionValue(id);
        return result;
    };

    FlatOS.System.User.prototype.getExternalUserPath = function(path, user) {
        var result;
        new FlatOS.Api.User(function(r) {
            result = r;
        }, false).getExternalUserPath(path, (user || this.user));
        return result;
    };

}(jQuery);