// Loading the Kernel
const FlatOS = require('./Kernel');

/**
 * Cache Manager
 *
 * Manage and allow data caching.
 *
 * @author      Axel Nana
 * @package     FlatOS
 * @subpackage  System
 * @constructor
 */
var Cache = function () {
    this.explorerCachePath = this.createCacheFile('flatos-cache-explorer-').path;
    this.contextMenuCachePath = this.createCacheFile('flatos-cache-contextMenu-').path;
};

/**
 * Create a new cache file and return the path.
 *
 * @param {String|object} affixes
 * @return {string}
 */
Cache.prototype.createCacheFile = function (affixes) {
    return FlatOS.load('FS').tmpfile(affixes);
};

/**
 * Gets a cached data
 *
 * @param {String} path
 * @param {String} index
 *
 * @throws Error
 *
 * @return {*}
 */
Cache.prototype.getCacheData = function (path, index) {
    index = index || null;
    path  = path  || null;
    
    if (path === null) {
        throw new Error('Data Cache Error: Cannot set data without a path.');
    }
    
    if (index === null) {
        return JSON.parse(FlatOS.load('FS').read(path));
    }
    else {
        var cachedData = JSON.parse(FlatOS.load('FS').read(path));
        return cachedData[index] || null;
    }
};

/**
 * Gets the Explorer Cache contents
 *
 * @return {object}
 */
Cache.prototype.explorerCache = function (index) {
    return this.getCacheData(this.explorerCachePath, index);
};

/**
 * Gets the Context Menu Cache contents
 *
 * @return {object}
 */
Cache.prototype.contextMenuCache = function (index) {
    return this.getCacheData(this.contextMenuCachePath, index);
};

/**
 * Gets the path to the Explorer Cache file
 *
 * @return {string|*}
 */
Cache.prototype.explorerPath = function () {
    return this.explorerCachePath;
};

/**
 * Gets the path to the Context Menu Cache file
 *
 * @return {string|*}
 */
Cache.prototype.contextMenuPath = function() {
    return this.contextMenuCachePath;
};

/**
 * Sets the content of a cached file
 *
 * @param {String} path The path to the file
 * @param {String} index The index of the JSON object
 * @param {*} data The data to set in the JSON object at the index provided
 *
 * @throws Error
 *
 * @return {boolean}
 */
Cache.prototype.setCacheData = function (path, index, data) {
    path  = path  || null;
    index = index || null;
    data  = data  || null;

    if (path === null) {
        throw new Error('Data Cache Error: Cannot set data without a path.');
    }

    if (index === null) {
        return false;
    }

    if (data === null) {
        if (typeof index === 'object') {
            return FlatOS.load('FS').write(path, JSON.stringify(index));
        }
        else {
            throw new Error('Data Cache Error: Cannot set data contents with non JSON data.');
        }
    }
    else {
        var cache = JSON.parse(FlatOS.load('FS').read(path));
        cache[index] = data;
        return FlatOS.load('FS').write(path, JSON.stringify(cache));
    }
};

/**
 * Sets the Explorer Cache Data
 *
 * @param {String} index
 * @param {*} data
 *
 * @return {boolean}
 */
Cache.prototype.setExplorerCacheData = function (index, data) {
    return this.setCacheData(this.explorerCachePath, index, data);
};

/**
 * Sets the Context Menu Cache Data
 *
 * @param {String} index
 * @param {*} data
 *
 * @return {boolean}
 */
Cache.prototype.setContextMenuCacheData = function (index, data) {
    return this.setCacheData(this.contextMenuCachePath, index, data);
};

// TODO: Allow apps to create their own cached file

// Exports the module
module.exports = new Cache();
