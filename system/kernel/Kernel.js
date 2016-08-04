/**
 * FlatOS
 *
 * The Kernel of the webos
 *
 * @author      Axel Nana
 * @package     FlatOS
 * @subpackage  System
 * @constructor
 */
var Kernel = function () {};

/**
 * The instance of Kernel
 *
 * Used to avoid multiple instances
 *
 * @type {object}
 */
Kernel.instance = null;

/**
 * Instances of currently
 * loaded modules.
 *
 * @type {object}
 */
Kernel.modules = {};

/**
 * Sets the module to load
 * in the Kernel.
 *
 * @param {String} module The name of the module to load.
 *
 * @return {object}
 */
Kernel.prototype.load = function (module) {
    var _f = require('fs');
    var _p = require('path');
    if (_f.existsSync(_p.join(__dirname, module + '.js'))) {
        var mod = module.toLowerCase();
        if (typeof Kernel.modules[mod] === 'undefined') {
            Kernel.modules[mod] = require('./' + module);
        }
        return Kernel.modules[mod];
    }
    else {
        throw new Error('Fatal Error: Cannot load the module "' + module + '". The module isn\'t found.');
    }
};

/**
 * Reloads a module in the Kernel.
 *
 * If the module wasn't loaded, it will be.
 *
 * @param {String} module The module to reload
 *
 * @return {function}
 */
Kernel.prototype.reload = function (module) {
    if (this.isLoaded(module)) {
        this.unload(module);
    }
    this.load(module);
};

/**
 * Checks if a module is already loaded in the Kernel.
 *
 * @param {String} module
 *
 * @return {boolean}
 */
Kernel.prototype.isLoaded = function (module) {
    var mod = module.toLowerCase();
    return !(typeof Kernel.modules[mod] === 'undefined');
};

/**
 * Unloads a module from the Kernel.
 *
 * @param {String} module
 */
Kernel.prototype.unload = function (module) {
    var mod = module.toLowerCase();
    if (this.isLoaded(module)) {
        delete Kernel.prototype[mod];
    }
};

// Exports the Kernel
if (Kernel.instance === null) {
    Kernel.instance = new Kernel();
}
module.exports = Kernel.instance;
