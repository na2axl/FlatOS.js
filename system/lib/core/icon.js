+function ($) {

    FlatOS.UI.Icon = function(opt) {
        if (typeof opt === 'string') {
            opt = {path: opt};
        }

        this.opt = $.extend( {}, {contextMenu: true, dblClick: true}, opt );

        this._f = new FlatOS.System.File(this.opt.path);
        this._m = new FlatOS.Input.Mouse();
        this._a = new FlatOS.System.Application.DefaultAppsManager();

        var FS = new FlatOS.System.FS();

        this.type = FS.extension(this.opt.path);

        if (FS.exists('system/ui/'+F.UI.icons+'/icons/'+this.type+'.svg')) {
            this.icon = $('<img src="system/ui/'+F.UI.icons+'/icons/'+this.type+'.svg" data-internal-path="'+this.opt.path+'" class="flatos_file_icon '+this.type+'">');
        }
        else {
            this.icon = $('<img src="system/ui/'+F.UI.icons+'/icons/file.svg" data-internal-path="'+this.opt.path+'" class="flatos_file_icon '+this.type+'">');
        }

        if (this.opt.contextMenu) {
            this._initContextMenu();
        }
        if (this.opt.dblClick) {
            this._initDoubleClick();
        }
    };

    FlatOS.UI.Icon.prototype = {

        getFileIcon: function() {
            return this.icon;
        },

        getIcon: function(name) {
            var FS = new FlatOS.System.FS();
            if (FS.exists('system/ui/'+F.UI.icons+'/icons/'+name+'.svg')) {
                return $('<img src="system/ui/'+F.UI.icons+'/icons/'+name+'.svg" data-internal-path="'+this.opt.path+'" class="flatos_file_icon '+name+'" />');
            }
            else {
                return $('<img src="system/ui/'+F.UI.icons+'/icons/file.svg" data-internal-path="'+this.opt.path+'" class="flatos_file_icon '+name+'" />');
            }
        },

        getContextMenu: function() {
            if (!F.Cache.ContextMenu.hasOwnProperty(this.opt.path)) {
                var that = this;
                var regApps = this._a.getRegApps(this.type),
                    contextMenu = {}, command = [];
                var Callback = new FlatOS.Callback();
                for (var i = 0, l = regApps.length; i < l; i++) {
                    var app_name = regApps[i];
                    var _app = new FlatOS.Application(app_name);
                    var config = _app.getAppConfig();
                    if (typeof config.contextMenu !== 'undefined') {
                        var info = _app.getInfo();
                        var titleMenu = {};
                        titleMenu[app_name] = {
                            title: {
                                name: info.app_name,
                                icon: info.app_icon,
                                title: true
                            }
                        };
                        for (var menu in config.contextMenu[app_name]) {
                            command.push(config.contextMenu[app_name][menu]);
                        }
                        $(command).each(function () {
                            var command = this.action;
                            this.callback = (function (_a, _n, _c, _t) {
                                return function () {
                                    _a.launch({
                                        callback: function () {
                                            Callback.call('contextMenu', _n + '_' + _c, _t.opt.path);
                                        }
                                    });
                                };
                            })(_app, app_name, command, that);
                        });
                        var ctm = $.extend(
                            {},
                            titleMenu[app_name],
                            config.contextMenu[app_name]
                        );
                        contextMenu[app_name] = $.extend(
                            {},
                            ctm
                        );
                    }
                }
                F.Cache.ContextMenu[this.opt.path] = $.extend(
                    {
                        open: {
                            open: {
                                name: 'Open',
                                callback: (function (that) {
                                    return function () {
                                        that._a.openWithDefault(that.opt.path);
                                    };
                                })(this)
                            }
                        }
                    },
                    contextMenu
                );
            }
            return F.Cache.ContextMenu[this.opt.path];
        },

        _initContextMenu: function() {
            this._m.contextualMenu(
                this.icon,
                this.getContextMenu()
            );
        },

        _initDoubleClick: function() {
            this._m.doubleClick('application.icon.launch', this.icon, (function(that) {
                return function () {
                    that._a.openWithDefault(that.opt.path);
                };
            })(this));
        }

    };

}(jQuery);