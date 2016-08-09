+function ($) {

    FlatOS.System.Application.DefaultAppsManager = function() {
        this._app = new FlatOS.Application({ process_name: '_flatos_default_apps_manager', isSystemApp: true });
    };

    FlatOS.System.Application.DefaultAppsManager.prototype = {
        getAppInfo: function() { },

        launchDefaultApp: function(extension) {
            var process_name = this.getDefaultApp(extension);
            if (process_name === false) {
                // TODO: Create the default app chooser window...
                return;
            }
            new FlatOS.Application(process_name).launch();
        },

        getRegExt: function(process_name) {
            var default_apps = this._app.getAppConfig();
            var regext = default_apps.registred_apps[process_name];
            if (typeof regext === 'undefined') {
                return true;
            }
            return regext.split(',');
        },

        getDefaultApp: function(extension) {
            var default_app = this._app.getUserConfig("default_apps")[extension] || this._app.getUserDefaultConfig("default_apps")[extension];
            if (typeof default_app === 'undefined') {
                return false;
            }
            return default_app;
        },

        getRegApps: function(extension) {
            var registred_apps = this._app.getAppConfig("registred_apps");
            var extArray, appArray = [];
            for (var app in registred_apps) {
                extArray = registred_apps[app].split(',');
                if (~extArray.indexOf(extension)) {
                    appArray.push(app);
                }
            }
            return appArray;
        },

        openWith: function (process_name, filepath) {
            var Callback = new FlatOS.Callback();
            if (process_name === false || typeof process_name === 'undefined') {
                return;
            }
            var _app = new FlatOS.Application(process_name);
            _app.launch({
                callback: function() {
                    var checker = Callback.get('checkfile', process_name);
                    if ($.isFunction(checker)) {
                        try {
                            if (checker(filepath)) {
                                Callback.call('open', process_name, filepath);
                            }
                            else {
                                new FlatOS.Window(process_name).dialogAlert({
                                    title: "Can't open the file",
                                    content: "This file is corrupted and can't be opened."
                                });
                            }
                        }
                        catch (e) {
                            new FlatOS.Window(process_name).dialogAlert({
                                title: "Can't open the file",
                                content: "This file is corrupted and can't be opened."
                            });
                        }
                    }
                    else {
                        Callback.call('open', process_name, filepath);
                    }
                }
            });
        },

        openWithDefault: function(filepath) {
            var FS = new FlatOS.System.FS();
            return this.openWith(this.getDefaultApp(FS.extension(filepath)), filepath);
        },

        changeDefaultApp: function() { },

        addDefaultApp: function() { },

        removeDefaultApp: function() { }
    };

}(jQuery);