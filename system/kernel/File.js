// Loading the Kernel
const FlatOS = require('./Kernel');

/**
 * File/Directory manager.
 *
 * Manager for the File Selector and the
 * File Saver system applications.
 *
 * @author      Axel Nana
 * @package     FlatOS
 * @subpackage  System
 * @constructor
 */
var File = function () { };

/**
 * Open a directory
 *
 * @param {String} path
 * @return {object}
 */
File.prototype.openDir = function (path) {
    var FS = FlatOS.load('FS');
    var contents = FS.readDir(path);
    var temp = {}, files = {};

    for (var file in contents) {
        if (contents.hasOwnProperty(file)) {
            temp[file] = {
                extension: FS.extension(contents[file]),
                path: contents[file],
                internalPath: FS.toInternalPath(contents[file]),
                externalPath: FS.toExternalPath(contents[file]),
                size: FS.size(contents[file]),
                sizeInOctets: FS.sizeInOctets(contents[file])
            };
        }
    }

    for (var name in temp) {
        if (name[0] == '.' && name != '..' && FS.isDir(temp[name]['path'])) {
            continue;
        }
        else {
            files[name] = temp[name];
        }
    }

    return files;
};

/**
 * Open a file.
 *
 * @param {String} path
 *
 * @return {{basename: String, filename: String, extension: String, internalPath: String, externalPath: String, lastModTime: int, lastAccessTime: int, createTime: int, size: int, sizeInOctets: String, mimetype: String, isBinary: boolean, contents: String}}
 */
File.prototype.openFile = function (path) {
    var FS = FlatOS.load('FS');

    return {
        basename: FS.basename(path),
        filename: FS.filename(path),
        extension: FS.extension(path),
        internalPath: FS.toInternalPath(path),
        externalPath: FS.toExternalPath(path),
        lastModTime: FS.lastModTime(path),
        lastAccessTime: FS.lastAccessTime(path),
        createTime: FS.createTime(path),
        size: FS.size(path),
        sizeInOctets: FS.sizeInOctets(path),
        mimetype: FS.mimetype(path),
        isBinary: FS.isBinary(path),
        contents: FS.read(path)
    };
};

/**
 * Open a file or a directory only if exists.
 *
 * @param {String} path
 *
 * @throws Error
 *
 * @return {object}
 */
File.prototype.open = function (path) {
    var FS = FlatOS.load('FS');

    if (FS.exists(path)) {
        if (FS.isDir(path)) {
            return this.openDir(path);
        }
        else {
            return this.openFile(path);
        }
    }
    else {
        throw new Error('The file/directory "' + path + '" doesn\'t exists');
    }
};

/**
 * Saves a file.
 *
 * @param {String} path
 * @param {String} contents
 * @param {boolean} append
 *
 * @link {FS.write()}
 *
 * @return {*}
 */
File.prototype.save = function (path, contents, append) {
    return FlatOS.load('FS').write(path, contents, append);
};

// Exports the module
module.exports = new File();
