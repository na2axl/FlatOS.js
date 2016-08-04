// Loading the Kernel
const FlatOS = require('./Kernel');

/**
 * User
 *
 * The user manager
 *
 * @author     Axel Nana
 * @package    FlatOS
 * @subpackage System
 * @constructor
 */
var User = function () {};

/**
 * User session data
 *
 * @type {object}
 * @private
 */
User.session = {};

/**
 * Gets the currently connected user name
 *
 * @return {string|null}
 */
User.prototype.getUsername = function () {
    return User.session['username'] || null;
};

/**
 * Gets the path to an user private directory
 *
 * @param {string} dir The directory
 *
 * @return {string}
 */
User.prototype.getUserDirectory = function (dir) {
    return FlatOS.load('FS').toInternalPath('~/' + (dir || ''));
};

/**
 * Lists the content of an user private directory
 *
 * @param {string} dir The directory
 *
 * @return {object}
 */
User.prototype.listUserDirectory = function (dir) {
    var userdir = this.getUserDirectory(dir);
    return FlatOS.load('File').openDir(userdir);
};

/**
 * Checks if a session is already running
 *
 * @return {boolean}
 */
User.prototype.isSession = function () {
    return (User.session !== {}) && (this.getUsername() !== null);
};

/**
 * Sets a session value
 *
 * @param {string} id The session's parameter name
 * @param {string} value The value of the parameter
 *
 * @return {void}
 */
User.prototype.setSessionValue = function (id, value) {
    User.session[id] = value;
};

/**
 * Gets a session value
 *
 * @param {string} id The session's parameter name
 *
 * @return {*}
 */
User.prototype.getSessionValue = function (id) {
    return User.session[id];
};

/**
 * Gets the list of all users
 *
 * @return {object}
 */
User.prototype.getUserList = function (id, value) {
    return FlatOS.load('FS').readDir('./users');
};

/**
 * Gets the external path to a private user directory/file
 *
 * @param {string} path The path to the file/directory
 * @param {string} user The name of the user
 *
 * @return {string}
 */
User.prototype.getExternalUserPath = function (path, user) {
    if (user) {
        var FS = require('./FS');
        FS.newAlias('~', 'users/' + user);
        return FS.toFileSystemPath(path);
    }
    else {
        return FlatOS.load('FS').toFileSystemPath(path);
    }
};

module.exports = new User();
