+function ($) {

    FlatOS.System.FS = function() {
        this.TMP_DIR = 'system/tmp';
        this.REAL_PATH = 1;
        this.INTERNAL_PATH = 2;
        this.EXTERNAL_PATH = 3;
        this.FILESYSTEM_PATH = 4;
    };

    FlatOS.System.FS.prototype.setRootpath = function (rootpath) {
        new FlatOS.Api.FS(null, false).setRootpath(rootpath);
    };

    FlatOS.System.FS.prototype.getRootpath = function () {
        var result;
        new FlatOS.Api.FS(function (r) {
            result = r;
        }, false).getRootpath();
        return result;
    };

    FlatOS.System.FS.prototype.setWorkingDir = function (workingDir) {
        new FlatOS.Api.FS(null, false).setWorkingDir(workingDir);
    };

    FlatOS.System.FS.prototype.getWorkingDir = function () {
        var result;
        new FlatOS.Api.FS(function (r) {
            result = r;
        }, false).getWorkingDir();
        return result;
    };

    FlatOS.System.FS.prototype.newAlias = function (key, value) {
        new FlatOS.Api.FS(null, false).newAlias(key, value);
    };

    FlatOS.System.FS.prototype.mkfile = function(path, createParents) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).mkfile(path, createParents);
        return result;
    }

    FlatOS.System.FS.prototype.read = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).read(path);
        return result;
    };

    FlatOS.System.FS.prototype.write = function(path, data, append) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).write(path, data, append);
        return result;
    };

    FlatOS.System.FS.prototype.delete = function(path, recursive) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).delete(path, recursive);
        return result;
    };

    FlatOS.System.FS.prototype.move = function(path, new_path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).move(path, new_path);
        return result;
    };

    FlatOS.System.FS.prototype.rename = function(path, new_path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).rename(path, new_path);
        return result;
    };

    FlatOS.System.FS.prototype.copy = function(path, new_path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).copy(path, new_path);
        return result;
    };

    FlatOS.System.FS.prototype.tmpfile = function(affixes) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).tmpfile(affixes);
        return result;
    };

    FlatOS.System.FS.prototype.mkdir = function(path, recursive) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).mkdir(path, recursive);
        return result;
    };

    FlatOS.System.FS.prototype.exists = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).exists(path);
        return result;
    };

    FlatOS.System.FS.prototype.isDir = function (path) {
        var result;
        new FlatOS.Api.FS(function (r) {
            result = r;
        }, false).isDir(path);
        return result;
    };

    FlatOS.System.FS.prototype.lastModTime = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).lastModTime(path);
        return result;
    };

    FlatOS.System.FS.prototype.lastAccessTime = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).lastAccessTime(path);
        return result;
    };

    FlatOS.System.FS.prototype.createTime = function (path) {
        var result;
        new FlatOS.Api.FS(function (r) {
            result = r;
        }, false).createTime(path);
        return result;
    };

    FlatOS.System.FS.prototype.basename = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).basename(path);
        return result;
    };

    FlatOS.System.FS.prototype.extension = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).extension(path);
        return result;
    };

    FlatOS.System.FS.prototype.filename = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).filename(path);
        return result;
    };

    FlatOS.System.FS.prototype.dirname = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).dirname(path);
        return result;
    };

    FlatOS.System.FS.prototype.size = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).size(path);
        return result;
    };

    FlatOS.System.FS.prototype.sizeInOctets = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).sizeInOctets(path);
        return result;
    };

    FlatOS.System.FS.prototype.mimetype = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).mimetype(path);
        return result;
    };

    FlatOS.System.FS.prototype.isBinary = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).isBinary(path);
        return result;
    };

    FlatOS.System.FS.prototype.readDir = function(path, recursive, options) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).readDir(path, recursive, options);
        return result;
    };

    FlatOS.System.FS.prototype.isRemote = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).isRemote(path);
        return result;
    };

    FlatOS.System.FS.prototype.removeHostFromPath = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).removeHostFromPath(path);
        return result;
    };

    FlatOS.System.FS.prototype.cleanPath = function (path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).cleanPath(path);
        return result;
    };

    FlatOS.System.FS.prototype.toInternalPath = function (path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).toInternalPath(path);
        return result;
    };

    FlatOS.System.FS.prototype.toExternalPath = function (path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).toExternalPath(path);
        return result;
    };

    FlatOS.System.FS.prototype.toFileSystemPath = function(path) {
        var result;
        new FlatOS.Api.FS(function(r) {
            result = r;
        }, false).toFileSystemPath(path);
        return result;
    };

}(jQuery);
