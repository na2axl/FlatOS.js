+function ($) {

    FlatOS.System.File = function () {

    };

    FlatOS.System.File.prototype.openDir = function (path) {
        var result;
        new FlatOS.Api.File(function(r) {
            result = r;
        }, false).openDir(path);
        return result;
    };

    FlatOS.System.File.prototype.openFile = function (path) {
        var result;
        new FlatOS.Api.File(function(r) {
            result = r;
        }, false).openFile(path);
        return result;
    };

    FlatOS.System.File.prototype.open = function (path) {
        var result;
        new FlatOS.Api.File(function(r) {
            result = r;
        }, false).open(path);
        return result;
    };

    FlatOS.System.File.prototype.save = function (path, contents, append) {
        var result;
        new FlatOS.Api.File(function(r) {
            result = r;
        }, false).save(path, contents, append);
        return result;
    };

}(jQuery);