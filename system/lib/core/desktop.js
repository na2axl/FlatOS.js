+function ($) {

    FlatOS.UI.Desktop = function () {
        // @ignore
    };

    FlatOS.UI.Desktop.prototype._loadIcons = function () {
        var that = this;
        new FlatOS.Api.User(function (file_list) {
            var $ul = $('#desktop-icons');
            $ul.empty();
            var Mouse = new FlatOS.Input.Mouse();
            var Keyboard = new FlatOS.Input.Keyboard();
            Mouse.contextualMenu($ul, {
                create: {
                    new_folder: {
                        name: 'New Folder',
                        callback: function () {
                            if (!$ul.hasClass('lock-for-new')) {
                                $ul.find('li').removeClass('ui-selected');
                                var icon = new FlatOS.UI.Icon();
                                var $li = $('<li></li>').append(icon.getIcon('folder'));
                                var $input = $('<input type="text" id="desktop-new-folder-input" autofocus />');
                                $li.append($('<span></span>').append($input));
                                Mouse.leftClickOnce('ui.desktop.create.folder', $ul, function () {
                                    create();
                                });
                                Keyboard.keyDown('ui.desktop.create.folder', $input, function (e) {
                                    if (e.keyCode === 191 || e.keyCode === 220 || e.keyCode === 106 ||
                                        e.keyCode === 111 || ((e.keyCode === 222 || e.keyCode === 191 || e.keyCode === 188 || e.keyCode === 190 || e.keyCode === 220 || e.keyCode === 186) && e.shiftKey)) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                    if (e.keyCode === 27) {
                                        $li.remove();
                                        $ul.removeClass('lock-for-new');
                                    }
                                    if (e.keyCode === 13) {
                                        create();
                                    }
                                });
                                var create = function () {
                                    filename = $input.val();
                                    if (filename.length > 0) {
                                        new FlatOS.Api.FS(function (exists) {
                                            if (exists) {
                                                new FlatOS.Notification('A folder with this name already exists.');
                                            }
                                            else {
                                                new FlatOS.Api.FS(function (success) {
                                                    if (success) {
                                                        that._loadIcons();
                                                    }
                                                    else {
                                                        new FlatOS.Notification('Cannot create the file. Try again please...');
                                                    }
                                                }).mkdir('~/Desktop/' + filename);
                                            }
                                        }).exists('~/Desktop/' + filename);
                                    }
                                    else {
                                        $li.remove();
                                        $ul.removeClass('lock-for-new');
                                    }
                                };
                                $li.appendTo($ul.addClass('lock-for-new'));
                                $input.focus();
                            }
                        }
                    },
                    new_file: {
                        name: 'New File',
                        callback: function () {
                            if (!$ul.hasClass('lock-for-new')) {
                                $ul.find('li').removeClass('ui-selected');
                                var icon = new FlatOS.UI.Icon();
                                var $li = $('<li></li>').append(icon.getFileIcon());
                                var $input = $('<input type="text" id="desktop-new-file-input" autofocus />');
                                $li.append($('<span></span>').append($input));
                                Mouse.leftClickOnce('ui.desktop.create.file', $ul, function () {
                                    create();
                                });
                                Keyboard.keyDown('ui.desktop.create.file', $input, function (e) {
                                    if (e.keyCode === 191 || e.keyCode === 220 || e.keyCode === 106 ||
                                        e.keyCode === 111 || ((e.keyCode === 222 || e.keyCode === 191 || e.keyCode === 188 || e.keyCode === 190 || e.keyCode === 220 || e.keyCode === 186) && e.shiftKey)) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                    if (e.keyCode === 27) {
                                        $li.remove();
                                        $ul.removeClass('lock-for-new');
                                    }
                                    if (e.keyCode === 13) {
                                        create();
                                    }
                                });
                                var create = function () {
                                    filename = $input.val();
                                    if (filename.length > 0) {
                                        new FlatOS.Api.FS(function (success) {
                                            if (success === false) {
                                                new FlatOS.Notification('Cannot create the file. Try again please...');
                                            }
                                            that._loadIcons();
                                        }).mkfile('~/Desktop/' + filename);
                                    }
                                    else {
                                        $li.remove();
                                        $ul.removeClass('lock-for-new');
                                    }
                                };
                                $li.appendTo($ul.addClass('lock-for-new'));
                                $input.focus();
                            }
                        }
                    }
                },
                view: {
                    small: {
                        name: 'Small icons',
                        callback: function () {
                            $ul.removeClass('small medium big').addClass('small');
                        }
                    },
                    medium: {
                        name: 'Medium icons',
                        callback: function () {
                            $ul.removeClass('small medium big').addClass('medium');
                        }
                    },
                    big: {
                        name: 'Big icons',
                        callback: function () {
                            $ul.removeClass('small medium big').addClass('big');
                        }
                    }
                },
                manage: {
                    refresh: {
                        name: 'Refresh',
                        callback: function () {
                            that._loadIcons();
                        }
                    }
                },
                properties: {
                    prop: {
                        name: 'Properties',
                        callback: function () {
                        }
                    }
                }
            });
            var i = 0;
            for (var file in file_list) {
                i++;
                var icon = new FlatOS.UI.Icon(file_list[file].internalPath);
                var $li = $('<li data-sort-id="icon_' + i + '" data-file-basename="' + file + '" data-internal-path="' + file_list[file].internalPath + '"></li>');
                $li
                    .append(icon.getFileIcon())
                    .append('<span>' + file + '</span>');
                $li.appendTo($ul);
                Mouse.leftClick('ui.desktop.icon.select', $li, function (e) {
                    if (!e.ctrlKey && !$(this).hasClass('ui-selected')) {
                        $ul.find('li').removeClass('ui-selected');
                    }
                    $(this).addClass('ui-selected');
                });
            }
            new FlatOS.Api.UserConfig(function (config) {
                config.order.forEach(function (o) {
                    $ul.find('li[data-sort-id=' + o + ']').appendTo($ul);
                });
                $ul.sortable({
                    containment: $("#windows"),
                    revert: true,
                    connectWith: ".flatos-files-list",
                    tolerance: "pointer",
                    stop: function (event, ui) {
                        ui.item.parent().selectable('refresh');
                        var order = ui.item.parent().sortable('toArray', { attribute: 'data-sort-id' });
                        new FlatOS.Api.UserConfig().setConfig('desktop', 'order', order);
                    }
                }).selectable({
                    filter: "> li",
                    tolerance: "touch",
                    autoRefresh: false
                });
            }).getConfig('desktop');
            Mouse.leftClick('ui.desktop', $ul, function () {
                $ul.get(0).tabIndex = 99;
                $ul.focus();
            });
            Keyboard.keyDown('ui.desktop', $ul, function (e) {
                if (e.keyCode === 13) {
                    var _a = new FlatOS.System.Application.DefaultAppsManager();
                    $ul.find('li.ui-selected').each(function () {
                        var $this = $(this);
                        setTimeout(function () {
                            _a.openWithDefault($this.attr('data-internal-path'));
                        }, 1000);
                    });
                }
                if (e.keyCode === 37) {
                    if ($ul.find('li').is('.ui-selected')) {
                        var $selected = $ul.find('li.ui-selected').eq($ul.find('li.ui-selected').length - 1);
                        $selected.prev().get(0) && ((e.shiftKey || $ul.find('li.ui-selected').removeClass('ui-selected')), (e.shiftKey ? $selected.removeClass('ui-selected') : $selected.prev().addClass('ui-selected')));
                    }
                    else {
                        $ul.find('li').eq(0).addClass('ui-selected');
                    }
                }
                if (e.keyCode === 39) {
                    if ($ul.find('li').is('.ui-selected')) {
                        var $selected = $ul.find('li.ui-selected').eq($ul.find('li.ui-selected').length - 1);
                        $selected.next().get(0) && ((e.shiftKey || $ul.find('li.ui-selected').removeClass('ui-selected')), $selected.next().addClass('ui-selected'));
                    }
                    else {
                        $ul.find('li').eq(0).addClass('ui-selected');
                    }
                }
            });
            $ul.appendTo('#windows');
        }).listUserDirectory('Desktop');
    };

    FlatOS.UI.Desktop.prototype.load = function (callback, timeOut) {
        callback = callback || null;
        timeOut = timeOut || 0;
        var User = new FlatOS.System.User();
        var that = this;
        new FlatOS.Layout('main-desktop.html', function (html) {
            var user = User.username();
            var config = new FlatOS.System.UserConfig(user).getConfig('ui');
            var bg_img = User.getExternalUserPath(config['background-image'], user);
            var bg_rpt = config['background-repeat'];
            var bg_mod = config['background-mode'];
            var $html = $(html);
            that.changeBackgroundImage(bg_img, $html);
            that.changeBackgroundTileMode(bg_rpt, $html);
            that.changeBackgroundMode(bg_mod, $html);

            new FlatOS.Interface().set("#desktop-wrapper", $html.hide(), true);

            that._loadIcons();

            setTimeout(callback, timeOut);
        });
    };

    FlatOS.UI.Desktop.prototype.changeBackgroundTileMode = function (mode, html) {
        html = html || $("#desktop-wrapper");
        mode ? $(html).find("#background").css('background-repeat', 'repeat') : $(html).find("#background").css('background-repeat', 'no-repeat');
    };

    FlatOS.UI.Desktop.prototype.changeBackgroundImage = function (image, html) {
        html = html || $("#desktop-wrapper");
        $(html).find("#background").css('background-image', 'url("' + image + '")');
    };

    FlatOS.UI.Desktop.prototype.changeBackgroundMode = function (mode, html) {
        html = html || $("#desktop-wrapper");
        switch (mode) {
            case 'fit':
                $(html).find("#background").css('background-size', 'auto 100%');
                $(html).find("#background").css('background-position', 'center center');
                break;

            case 'fill':
                $(html).find("#background").css('background-size', '100% auto');
                $(html).find("#background").css('background-position', 'center center');
                break;

            case 'stretch':
                $(html).find("#background").css('background-size', '100% 100%');
                $(html).find("#background").css('background-position', 'center center');
                break;

            case 'tile':
                $(html).find("#background").css('background-size', 'unset');
                $(html).find("#background").css('background-repeat', 'repeat');
                break;

            case 'center':
                $(html).find("#background").css('background-size', 'unset');
                $(html).find("#background").css('background-position', 'center center');
                break;
        }
    };

}(jQuery);
