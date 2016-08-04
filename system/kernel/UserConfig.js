// Loading the Kernel
const FlatOS = require('./Kernel');

/**
 * UserConfig
 *
 * The user's configuration manager
 *
 * @author      Axel Nana
 * @package     FlatOS
 * @subpackage  System
 * @constructor
 */
var UserConfig = function () {};

/**
 * Gets a configuration file from an user
 *
 * @param {string}  configfile The configuration file name.
 * @param {string}  index      The index where to set the value.
 * @param {*}       value      The value to set.
 *
 * @return {boolean}
 *
 * @throws Error
 */
UserConfig.prototype.setConfig = function (configfile, index, value) {
    configfile = configfile || null;
    index = index || null;
    value = value || null;

    if (configfile === null) {
        throw new Error('Cannot call UserConfig::setConfig with no configuration file to load.');
    }

    var FS = FlatOS.load('FS');

    var filepath = '~/.config/' + configfile + '.json';

    if (!FS.exists(filepath)) {
        FS.write(filepath, "{}");
    }

    if (index === null) {
        throw new Error('Cannot write an user configuration without any value. If you want to reset the configuration file, set the value to an empty ovject.');
    }
    else {
        if (value === null) {
            if (typeof index === 'object') {
                index = JSON.stringify(index);
            }
            return FS.write(filepath, index);
        }
        else {
            var config = JSON.parse(FS.read(filepath));
            config[index] = value;
            return FS.write(filepath, JSON.stringify(config));
        }
    }
};

/**
 * Gets a configuration file from an user
 *
 * @param {string}  configfile The configuration file name.
 * @param {boolean} required   If the file is required or not.
 * @param {string}  user       The specific user.
 *
 * @return {object}
 *
 * @throws Error
 */
UserConfig.prototype.getConfig = function (configfile, required, user) {
    configfile = configfile || null;
    required = required || false;
    user = user || null;

    if (configfile === null) {
        throw new Error('Can\'t call UserConfig::getConfig with no configuration file to load.');
    }

    var FS;

    if (user !== null) {
        FS = require('./FS');
        FS.newAlias('~', 'users/' + user);
    }
    else {
        user = FlatOS.load('User').getUsername();
        FS = FlatOS.load('FS');
    }

    var filepath = '~/.config/' + configfile + '.json';

    if (FS.exists(filepath)) {
        var config = FS.read(filepath);
        return JSON.parse(config);
    }
    else {
        if (required) {
            throw new Error('The configuration file "' + configfile + '" doesn\'t exists for the user "' + user + '".');
        }
        else {
            return {};
        }
    }
};

// Exports the module
module.exports = new UserConfig();