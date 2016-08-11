// Loading the Kernel
const FlatOS = require('./Kernel');

// TODO: Make copy, delete, rename, move method to async !

/**
 * FS
 *
 * The FileSystem of FlatOS.
 *
 * This constructor sets the default root path,
 * the default working directory,
 * and defaults aliases.
 *
 * @author      Axel Nana
 * @package     FlatOS
 * @subpackage  System
 *
 * @param {string} rootpath The rootpath of the file system. If no rootpath
 *                          is defined, the default one will be used.
 *
 * @return {void}
 */
var FS = function FS(rootpath) {
    var User = FlatOS.load('User');
    var _p = require('path');

    if (typeof rootpath === 'undefined') {
        this.setRootpath(_p.dirname(_p.dirname(_p.dirname(__filename))));
    }
    else {
        this.setRootpath(this.cleanPath(rootpath));
    }

    if (User.isSession()) {
        this.newAlias('~', 'users/' + User.getUsername());
    }

    this.setWorkingDir('/');
};

/**
 * Checks if the file is readable
 *
 * @param {string} path The path to the file
 *
 * @return {boolean}
 */
FS.is_readable = function (path) {
    var _f = require('fs');
    _f.accessSync(path, _f.R_OK);
    return true;
};

/**
 * Checks if the file is writable
 *
 * @param {string} path The path to the file
 *
 * @return {boolean}
 */
FS.is_writable = function (path) {
    var _f = require('fs');
    _f.accessSync(path, _f.W_OK)
    return true;
};

/**
 * The temp directory
 *
 * @const {string}
 */
FS.TMP_DIR = 'system/tmp';

/**
 * Choose to output the real filepath
 *
 * @const {int}
 */
FS.REAL_PATH = 1;

/**
 * Choose to output the internal filepath
 *
 * @const {int}
 */
FS.INTERNAL_PATH = 2;

/**
 * Choose to output the external filepath
 *
 * @const {int}
 */
FS.EXTERNAL_PATH = 3;

/**
 * Choose to output the external filepath
 *
 * @const {int}
 */
FS.FILESYSTEM_PATH = 4;

/**
 * The FileSystem root path
 *
 * @var {string}
 * @access {protected}
 */
FS.prototype.rootpath = '';

/**
 * The current working directory
 *
 * @var {string}
 * @access {protected}
 */
FS.prototype.workingDir = '';

/**
 * Aliasies
 *
 * @var {string}
 * @access {protected}
 */
FS.prototype.aliases = {};

/**
 * Sets the file system rootpath
 *
 * @param {string} rootpath The path to the directory
 *
 * @return {object}
 */
FS.prototype.setRootpath = function (rootpath) {
    this.rootpath = this.cleanPath(rootpath);
    return this;
};

/**
 * Gets the value of rootpath
 *
 * @return {string}
 */
FS.prototype.getRootpath = function () {
    return this.rootpath;
};

/**
 * Sets the current working directory
 *
 * @param {String} workingDir The path to the working directory
 *
 * @return {object}
 */
FS.prototype.setWorkingDir = function (workingDir) {
    this.workingDir = workingDir;
    return this;
};

/**
 * Gets the current working directory
 *
 * @return {string}
 */
FS.prototype.getWorkingDir = function () {
    return this.workingDir;
};

/**
 * Gets the aliases
 *
 * @return {object}
 */
FS.prototype.getAliases = function () {
    return this.aliases;
};

/**
 * Creates a new alias
 *
 * @param {String} key The key of the alias
 * @param {String} val The value of the alias
 *
 * @return {void}
 */
FS.prototype.newAlias = function (key, val) {
    if (val.substr(-1) == '/') {
        val = val.substr(0, -1);
    }
    this.aliases[key] = val;
};

/**
 * Create a new file
 *
 * @param {String} path         The path of the new file
 * @param {boolean} createParent Define if we have to create parent directories
 *
 * @throws Error
 *
 * @return {boolean}
 */
FS.prototype.mkfile = function (path, createParent) {
    createParent = createParent || false;

    var parentDir = this.dirname(path);
    var _f = require('fs');

    if (!this.exists(parentDir)) {
        if (createParent) {
            this.mkdir(parentDir, true);
        }
        else {
            throw new Error('Cannot create file "' + path + '" (parent directory "' + parentDir + '" doesn\'t exist)');
        }
    }

    var internalPath = this.toInternalPath(path);

    if (!this.exists(internalPath)) {
        if (_f.closeSync(_f.openSync(internalPath, 'w'))) {
            _f.chmodSync(internalPath, 0777);
            return true;
        }
        if (!this.exists(internalPath)) {
            throw new Error('Cannot create file "' + path + '"');
        }
    }
    else {
        throw new Error('Cannot create file "' + path + '" (the file already exist)');
    }

};

/**
 * Read the file's contents
 *
 * @param {String}  path   The path to the file
 * @param {boolean} noUTF8 Defines that if we use UTF-8 encoding
 *
 * @throws Error
 *
 * @return {String}
 */
FS.prototype.read = function (path, noUTF8) {
    noUTF8 = noUTF8 || false;
    var internalPath = this.toInternalPath(path);
    var _f = require('fs');

    if (!this.isRemote(path) && !FS.is_readable(internalPath)) {
        throw this._accessDeniedException(path, 'read');
    }

    var contents = _f.readFileSync(internalPath, (noUTF8 ? '' : 'utf8'));

    if (contents === false) {
        throw new Error('Cannot read the file "' + path + '"');
    }

    return contents;
};

/**
 * Write in the file
 *
 * @param  {string} path   The file to write in
 * @param  {string} data   The new contents of the file
 * @param  {boolean} append If the datas have to be appended in the file
 *
 * @throws Error
 *
 * @return {boolean}
 */
FS.prototype.write = function (path, data, append) {
    append = append || false;

    var internalPath = this.toInternalPath(path);
    var applyChmod = false;
    var flag = 'w';
    var _f = require('fs');

    if (append === true) {
        flag = 'a';
    }

    if (this.exists(path)) {
        if (!this.isRemote(path) && !FS.is_writable(internalPath)) {
            throw this._accessDeniedException(path, 'write');
        }
    }
    else {
        applyChmod = true;
        this.mkfile(path, true);
    }

    if (_f.writeFileSync(internalPath, data, { flag: flag }) !== false) {
        if (applyChmod) {
            _f.chmodSync(internalPath, 0777);
        }
        return true;
    }
    else {
        throw new Error('Cannot write in the file "' + path + '"');
    }
};

/**
 * Delete the file
 *
 * @param  {string} path       The path to the file to delete
 * @param  {boolean} recursive  Define if we have to delete all subfiles
 *
 * @throws Error
 *
 * @return {boolean}
 */
FS.prototype.delete = function (path, recursive) {
    recursive = recursive || false;

    var internalPath = this.toInternalPath(path);
    var _f = require('fs');

    if (this.exists(path)) {
        _f.chmodSync(internalPath, 0777);
        if (this.isDir(path)) {
            if (recursive === true) {
                var subfiles = this.readDir(path);
                for (var fileToDelete in subfiles) {
                    if (subfiles.hasOwnProperty(fileToDelete)) {
                        this.delete(subfiles[fileToDelete], recursive);
                    }
                }
            }
            if (_f.rmdirSync(internalPath) === false) {
                throw new Error('Cannot delete directory "' + path + '"');
            }
            else {
                return true;
            }
        }
        else {
            if (_f.unlinkSync(internalPath) === false) {
                throw new Error('Cannot delete file "' + path + '"');
            }
            else {
                return true;
            }
        }
    }
    else {
        throw new Error('The file "' + path + '" doesn\'t exist.');
    }
};

/**
 * Move the file
 *
 * @param {string} path     The current path of the file
 * @param {string} new_path The new path of the file
 *
 * @throws Error
 *
 * @return {boolean}
 */
FS.prototype.move = function (path, new_path) {
    if (this.isDir(new_path) && !this.isDir(path)) {
        new_path = this.cleanPath(new_path + '/' + this.basename(path));
    }

    var destDirname = this.dirname(new_path);
    var _f = require('fs');

    if (!this.exists(destDirname)) {
        this.mkdir(destDirname, true);
    }

    if (!this.exists(path)) {
        throw new Error('Cannot move file from "' + path + '" to "' + new_path + '" : source directory "' + path + '" doesn\'t exist');
    }

    var destInternalPath = this.toInternalPath(new_path);
    var sourceInternalPath = this.toInternalPath(path);

    if (_f.renameSync(sourceInternalPath, destInternalPath)) {
        throw new Error('Cannot move file from "' + path + '" to "' + new_path + '"');
    }
    else {
        return true;
    }
};

/**
 * Rename the file
 *
 * @param {string} path     The current path of the file
 * @param {string} new_name The new name of the file
 *
 * @throws Error
 *
 * @return {boolean}
 */
FS.prototype.rename = function (path, new_name) {
    var new_path = this.dirname(path) + '/' + new_name;
    return this.move(path, this.cleanPath(new_path));
};

/**
 * Copy a file
 *
 * @param {string} path     The path of the file to copy
 * @param {string} new_path The path of the destination
 *
 * @throws Error
 *
 * @return {boolean}
 */
FS.prototype.copy = function (path, new_path) {
    if (this.isDir(new_path) && !this.isDir(path)) {
        new_path += '/' + this.basename(path);
    }

    var destDirname = this.dirname(new_path);

    if (!this.exists(destDirname)) {
        throw new Error('Cannot copy file from "' + path + '" to "' + new_path + '" : destination directory "' + destDirname + '" doesn\'t exist');
    }

    if (!this.exists(path)) {
        throw new Error('Cannot copy file from "' + path + '" to "' + new_path + '" : source directory "' + path + '" doesn\'t exist');
    }

    var destInternalPath = this.toInternalPath(new_path);
    var sourceInternalPath = this.toInternalPath(path);

    if (this.isDir(sourceInternalPath)) {
        if (!this.exists(new_path)) {
            this.mkdir(new_path);
        }
        var subfiles = this.readDir(path);
        for (var fileToCopyName in subfiles) {
            this.copy(path + '/' + fileToCopyName, new_path + '/' + fileToCopyName);
        }
        return true;
    }
    else {
        var contents = this.read(sourceInternalPath);
        if (this.write(destInternalPath, contents) === false) {
            throw new Error('Cannot copy file from "' + path + '" to "' + new_path + '"');
        }
        else {
            return true;
        }
    }
};

/**
 * Create a new temporary file.
 *
 * @param {object} affixes
 *
 * @return {string} The temporary file path.
 */
FS.prototype.tmpfile = function (affixes) {
    var tmpDir = this.toInternalPath(FS.TMP_DIR);

    if (!this.isDir(tmpDir)) {
        this.mkdir(tmpDir, true);
    }

    affixes = affixes || {};
    if (typeof affixes.valueOf() === 'string') {
        affixes = { prefix: affixes };
    }
    if (typeof affixes.track === 'undefined') {
        affixes.track = true;
    }
    affixes.dir = tmpDir;

    var temp = require('temp');

    if (affixes.track) {
        temp.track();
    }

    return temp.openSync(affixes);
};

/**
 * Create a new directory
 *
 * @param {string} path      The path of the new directory
 * @param {boolean} recursive Define if we have to create all parent directories
 *
 * @throws Error
 *
 * @return {boolean}
 */
FS.prototype.mkdir = function (path, recursive) {
    recursive = recursive || false;

    var internalPath = this.toInternalPath(path);
    var _f = require('fs');

    if (recursive) {
        if (!this.exists(this.dirname(path))) {
            return this.mkdir(this.dirname(path));
        }
    }

    if (_f.mkdirSync(internalPath, 0777) === false) {
        throw new Error('Cannot create directory "' + path + '"');
    }
    else {
        _f.chmodSync(internalPath, 0777);
        return true;
    }
};

/**
 * Check if the file exists
 *
 * @param {string} path The path to the file
 *
 * @return {boolean}
 */
FS.prototype.exists = function (path) {
    var _f = require('fs');
    return _f.existsSync(this.toInternalPath(path));
};

/**
 * Check if the file is a directory
 *
 * @param {string} path The path to the file
 *
 * @return {boolean}
 */
FS.prototype.isDir = function (path) {
    var _f = require('fs');
    if (this.exists(path)) {
        return _f.lstatSync(this.toInternalPath(path)).isDirectory();
    }
    return false;
};

/**
 * Gets the file's last modification time
 *
 * @param {string} path The path to the file
 *
 * @return {int}
 */
FS.prototype.lastModTime = function (path) {
    var _f = require('fs');
    return _f.lstatSync(this.toInternalPath(path)).ctime.getTime();
};

/**
 * Gets the file's last acces time
 *
 * @param {string} path The path to the file
 *
 * @return {int}
 */
FS.prototype.lastAccessTime = function (path) {
    var _f = require('fs');
    return _f.lstatSync(this.toInternalPath(path)).atime.getTime();
};

/**
 * Gets the file's creation time
 *
 * @param {string} path The path to the file
 *
 * @return {int}
 */
FS.prototype.createTime = function (path) {
    var _f = require('fs');
    return _f.lstatSync(this.toInternalPath(path)).birthtime.getTime();
};

/**
 * Gets the file's basename
 *
 * @param {string} path The path to the file
 *
 * @return {string}
 */
FS.prototype.basename = function (path) {
    var _p = require('path');
    return _p.basename(this.toInternalPath(path));
};

/**
 * Get the file's extension
 *
 * @param {string} path the path to the file
 *
 * @return {string}
 */
FS.prototype.extension = function (path) {
    var _p = require('path');
    if (path && this.isDir(path)) {
        return 'folder';
    }
    return _p.extname(path).substr(1);
};

/**
 * Get the file's name without extension
 *
 * @param {string} path the path to the file
 *
 * @return {string}
 */
FS.prototype.filename = function (path) {
    var _p = require('path');
    return _p.basename(this.toInternalPath(path), '.' + this.extension(path));
};

/**
 * Get the parent directory of a file
 *
 * @param {string} path The path to the file
 *
 * @return {string}
 */
FS.prototype.dirname = function (path) {
    var dirname;

    if (~path.indexOf('/', 1)) {
        dirname = path.replace(/\/[^\/]*\/?$/, '');
    }
    else if (~path.indexOf('/') === 0) {
        dirname = '/';
    }
    else {
        dirname = false;
    }

    if (dirname == '.') {
        dirname = false;
    }

    if (dirname == this.toFileSystemPath('/users') || dirname == this.toInternalPath('/users')) {
        dirname = false;
    }

    return dirname;
};

/**
 * Get the file's size
 *
 * @param {string} path The path to the file
 *
 * @return {int}
 */
FS.prototype.size = function (path) {
    var _f = require('fs');

    if (this.isDir(path)) {
        var totalSize = 0;
        var files = this.readDir(path);

        for (var filepath in files) {
            if (files.hasOwnProperty(filepath)) {
                totalSize += this.size(files[filepath]);
            }
        }

        return totalSize;
    }
    else {
        return _f.lstatSync(this.toInternalPath(path)).size;
    }
};

/**
 * Get the file's size in octects
 *
 * @param {string} path The path to the file
 *
 * @return {string}
 */
FS.prototype.sizeInOctets = function (path) {
    var size = this.size(path);
    var _converter = require('file-size');

    return _converter(size).human('si');
};

/**
 * Get the file's MIME type.
 *
 * @param {String} path The file's path.
 *
 * @return {String}
 */
FS.prototype.mimetype = function (path) {
    var fileExtension = this.extension(path);
    var mime = require('mime');
    var _f = require('fs');
    mime.define(JSON.parse(this.read('/system/etc/registry/types.json')));
    return mime.lookup(fileExtension);
};

/**
 * Check if a file is a binary file.
 *
 * @param {string} path The file path.
 *
 * @return {boolean}
 */
FS.prototype.isBinary = function (path) {
    var mime = this.mimetype(path);
    return (mime.substr(0, 5) != 'text/');
};

/**
 * Read all elements in a directory
 *
 * @param {string}  path       The path of the diretory
 * @param {boolean} recursive  Define if the directory have to be readed recursively
 * @param {object}  options    Additional options to use :
 *                             append_parent => Add the .. directory which point to the parent
 *                             path_type     => The type of file path;
 *                             file_type     => The extension(s) of files to select;
 *                             filter        => The extension(s) of files to ignore.
 *
 * @return {object}
 */
FS.prototype.readDir = function (path, recursive, options) {
    recursive = recursive || false;
    options = options || { 'path_type': FS.REAL_PATH, 'file_type': false, 'filter': false };

    if (!this.isRemote(path) && !FS.is_readable(this.toInternalPath(path))) {
        throw this._accessDeniedException(path, 'read');
    }

    options['path_type']     = typeof options['path_type'] === 'undefined' ? FS.REAL_PATH : options['path_type'];
    options['file_type']     = typeof options['file_type'] === 'undefined' ? false : options['file_type'];
    options['filter']        = typeof options['filter'] === 'undefined' ? false : options['filter'];
    // path = this.toInternalPath(path);

    var files = {};
    var _f = require('fs');

    if (FS.is_readable(path)) {
        var handle = _f.readdirSync(path);
        for (var i = 0, l = handle.length, file; i < l; ++i) {
            file = handle[i];
            var filepath = this.cleanPath(path + '/' + file);

            // Applying filters
            if (typeof options['filter'].valueOf() === 'string' && this.extension(filepath) == options['filter']) {
                continue;
            }
            if (typeof options['filter'] === 'object' && !!~options['filter'].indexOf(this.extension(filepath))) {
                continue;
            }
            // Skipping unwanted files
            if (typeof options['file_type'].valueOf() === 'string' && this.extension(filepath) != options['file_type']) {
                continue;
            }
            if (typeof options['file_type'] === 'object' && !!~options['file_type'].indexOf(this.extension(filepath))) {
                continue;
            }

            switch (options['path_type']) {
                default:
                case FS.REAL_PATH:
                    files[file] = filepath;
                    break;

                case FS.INTERNAL_PATH:
                    files[file] = this.toInternalPath(filepath);
                    break;

                case FS.EXTERNAL_PATH:
                    files[file] = this.toExternalPath(filepath);
                    break;

                case FS.FILESYSTEM_PATH:
                    files[file] = this.toFileSystemPath(filepath);
                    break;
            }

            if (recursive === true && this.isDir(filepath)) {
                var subfiles = this.readDir(filepath, recursive, options);
                for (var subfilename in subfiles) {
                    if (subfiles.hasOwnProperty(subfilename)) {
                        files[file + '/' + subfilename] = subfiles[subfilename];
                    }
                }
            }
        }
        // ksort(files);

        return files;
    }
    else {
        throw this._accessDeniedException(path, 'open');
    }
};


/**
 * Check if the path is remote
 *
 * Returns TRUE if the path is remote,
 * and FALSE otherwise.
 *
 * @param {string} path The path to Check
 *
 * @return {boolean}
 */
FS.prototype.isRemote = function (path) {
    return !!(~path.indexOf('://'));
};

/**
 * Remove the hostname from the path
 *
 * @param {string} path The path to revome the hostname
 *
 * @return {string}
 */
FS.prototype.removeHostFromPath = function (path) {
    var url = require('url');
    return url.parse(path).path;
};

/**
 * Clean the path for bad directory name
 *
 * @param {string} path The path to clean
 *
 * @return {string}
 */
FS.prototype.cleanPath = function (path) {
    if (this.isRemote(path)) {
        return path;
    }

    var badDirs = path.split('/');
    var cleanDirs = [];

    for (var i = 0, l = badDirs.length, dir; i < l; ++i) {
        dir = badDirs[i];

        if (dir == '..') {
            cleanDirs.pop();
        }
        else if (dir == '.') {
            continue;
        }
        else if (!dir && i > 0) {
            continue;
        }
        else {
            cleanDirs.push(dir);
        }
    }

    var beautifiedPath;
    if (path != '/') {
        beautifiedPath = cleanDirs.join('/');
    }

    if (typeof beautifiedPath === 'undefined') {
        beautifiedPath = (path.substr(0, 1) == '/') ? '/' : '.';
    }

    return beautifiedPath;
};

/**
 * Transform a path to an internal FileSystem path
 *
 * @param {string} path The path to transform
 *
 * @return {string}
 */
FS.prototype.toInternalPath = function (path) {
    var internalPath = path;
    var _p = require('path');

    // Do nothing if is a remote path
    if (this.isRemote(internalPath)) {
        return internalPath;
    }

    if (internalPath.substr(0, this.getRootpath().length) == this.getRootpath()) {
        internalPath = internalPath.replace(this.getRootpath(), './');
    }
    else {
        var realRootPath = _p.normalize(this.getRootpath());
        if (internalPath.substr(0, realRootPath.length) == realRootPath) {
            internalPath = internalPath.substr(realRootPath.length);
        }
    }

    // Convert relative path to absolute path
    if (internalPath.match(/^(\.)+\//)) {
        internalPath = this.getWorkingDir() + '/' + internalPath;
    }

    // Remove aliases
    var nbrTurns = 0;
    var maxNbrTurns = this.aliases.length;
    do {
        var appliedAliasesNbr = 0;

        for (var key in this.aliases) {
            if (internalPath.substr(0, key.length) == key) {
                internalPath = this.aliases[key] + '/' + internalPath.substr(key.length);
                appliedAliasesNbr++;
            }
        }

        nbrTurns++;
    } while (appliedAliasesNbr > 0 && nbrTurns <= maxNbrTurns);

    // Prepend the root path
    var rootPath = this.getRootpath();
    if (rootPath) {
        internalPath = rootPath + '/' + internalPath;
    }

    return this.cleanPath(internalPath);
};

/**
 * Convert an internal path to an external path.
 *
 * @param {string} internalPath The internal path.
 *
 * @return {string}
 */
FS.prototype.toExternalPath = function (internalPath) {
    var externalPath = this.toInternalPath(internalPath);
    var _p = require('path');

    if (this.isRemote(externalPath)) {
        return externalPath;
    }

    if (externalPath.substr(0, this.getRootpath().length) == this.getRootpath()) {
        externalPath = externalPath.substr(this.getRootpath().length);
    }
    else {
        var realRootPath = _p.normalize(this.getRootpath());
        if (externalPath.substr(0, realRootPath.length) == realRootPath) {
            externalPath = externalPath.substr(realRootPath.length);
        }
    }

    if (externalPath[0] != '/') {
        return internalPath;
    }

    // Apply aliases
    var nbrTurns = 0;
    var maxNbrTurns = this.aliases.length;
    do {
        var appliedAliasesNbr = 0;

        for (var key in this.aliases) {
            var value = this.aliases[key];
            if (value[0] != '/') {
                value = '/' + value;
            }

            if (externalPath.substr(0, value.length) == value) {
                externalPath = key + '/' + externalPath.substr(value.length);
                appliedAliasesNbr++;
            }
        }

        nbrTurns++;
    } while (appliedAliasesNbr > 0 && nbrTurns <= maxNbrTurns);

    return this.cleanPath(externalPath);
}

/**
 * Convert an internal path to an absolute path
 * which start on the filesystem rootpath
 *
 * @param {string} internalPath The internal path.
 *
 * @return {string}
 */
FS.prototype.toFileSystemPath = function (internalPath) {
    var externalPath = this.toInternalPath(internalPath);
    var _p = require('path');

    if (this.isRemote(externalPath)) {
        return externalPath;
    }

    // Remove the rootpath
    if (externalPath.substr(0, this.getRootpath().length) == this.getRootpath()) {
        externalPath = externalPath.substr(this.getRootpath().length);
    }
    else {
        var realRootPath = _p.normalize(this.getRootpath());
        if (externalPath.substr(0, realRootPath.length) == realRootPath) {
            externalPath = externalPath.substr(realRootPath.length);
        }
    }

    // Apply aliases
    var nbrTurns = 0;
    var maxNbrTurns = this.aliases.length;
    do {
        var appliedAliasesNbr = 0;

        for (var key in this.aliases) {
            if (externalPath.substr(0, key.length) == key) {
                externalPath = this.aliases[key] + '/' + externalPath.substr(key.length);
                appliedAliasesNbr++;
            }
        }

        nbrTurns++;
    } while (appliedAliasesNbr > 0 && nbrTurns <= maxNbrTurns);

    while (externalPath.substr(0, 1) == '/' || externalPath.substr(0, 2) == './') {
        externalPath = externalPath.substr(1);
    }

    return this.cleanPath(externalPath);
};

/**
 * Used to throw an access denied exception
 *
 * @param {string} path   The path to the file
 * @param {string} action The type of access denied
 *
 * @return {Error}
 */
FS.prototype._accessDeniedException = function (path, action) {
    action = action || 'write';

    var msg = 'Cannot ' + action + ' the file "' + path + '": permission denied';
    if (!this.isRemote(path)) {
        msg += " (The web server user cannot " + action + " files, chmod needed)";
    }
    return new Error(msg);
};

// Exports the module
module.exports = new FS();
module.exports.REAL_PATH = FS.REAL_PATH;
module.exports.INTERNAL_PATH = FS.INTERNAL_PATH;
module.exports.EXTERNAL_PATH = FS.EXTERNAL_PATH;
module.exports.FILESYSTEM_PATH = FS.FILESYSTEM_PATH;
