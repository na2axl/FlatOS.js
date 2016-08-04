// Loading the Kernel
const FlatOS = require('./Kernel');

/**
 * UserInterface
 *
 * Load and manage the user interface of the current user.
 *
 * @author      Axel Nana
 * @package     FlatOS
 * @subpackage  System
 * @constructor
 */
var UserInterface = function () {};

/**
 * Path to the JsonConfig includes files
 *
 * @const {string}
 */
UserInterface.INCLUDES_PATH = 'system/etc/boot/includes.json';

/**
 * The Renderer used for interfaces
 */
UserInterface.renderer = require('ejs');

/**
 * Gets the list of files to include in the UI.
 *
 * @return {object}
 * @private
 */
UserInterface.prototype._getIncludes = function () {
    var userCSS, userJS, coreCSS, coreJS;
    var User = FlatOS.load('User');
    var FS = FlatOS.load('FS');

    coreCSS = FS.readDir("system/ui/core/interface", true, {'file_type': 'css', 'path_type': FS.FILESYSTEM_PATH});
    coreJS = JSON.parse(FS.read(UserInterface.INCLUDES_PATH));

    if (User.isSession()) {
        var ui = FlatOS.load('UserConfig').getConfig('ui', true);
        User.setSessionValue('interface', ui['interface']);
        User.setSessionValue('icons', ui['icons']);
        userCSS = FS.readDir("system/ui/" + User.getSessionValue('interface') + "/interface", true, {'file_type': 'css', 'path_type': FS.FILESYSTEM_PATH});
        userJS = FS.readDir("system/ui/" + User.getSessionValue('interface') + "/interface", true, {'file_type': 'js', 'path_type': FS.FILESYSTEM_PATH});
    }
    else {
        userCSS = FS.readDir("system/ui/flatos/interface", true, {'file_type': 'css', 'path_type': FS.FILESYSTEM_PATH});
        userJS = FS.readDir("system/ui/flatos/interface", true, {'file_type': 'js', 'path_type': FS.FILESYSTEM_PATH});
    }

    return {
        'css': {
            'core': coreCSS,
            'user': userCSS
        },
        'js': {
            'core': coreJS,
            'user': userJS
        }
    };

};

/**
 * Renders the default layout with the user's interface
 *
 * @return {String}
 */
UserInterface.prototype.render = function () {
    var config = this._getIncludes();
    var content = FlatOS.load('FS').read('./boot/layout.ejs');

    return UserInterface.renderer.render(content, {
        css: config['css'],
        js: config['js']
    });
};

UserInterface.prototype.compile = function (html, options) {
    return UserInterface.renderer.render(html, options);
};

// Exports the module
module.exports = new UserInterface();