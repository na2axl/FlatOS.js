+function ($) {

    /**
     * Application's Taskbar Icon Manager
     * @param {{process_name: String, instance_id: int}|String} opt
     * @constructor
     */
    FlatOS.UI.Taskbar = function(opt) {
        if (typeof opt === 'string') {
            opt = {process_name: opt};
        }
        this.options = $.extend( {}, {process_name: '', instance_id: 0}, opt );
    };

    FlatOS.UI.Taskbar.prototype.load = function() {
        F.Taskbar.load();
    };

    FlatOS.UI.Taskbar.prototype.refresh = function() {
        F.Taskbar.refresh();
    };

    FlatOS.UI.Taskbar.prototype.get = function() {
        return F.Taskbar.get(this.options.process_name, this.options.instance_id);
    };

    FlatOS.UI.Taskbar.prototype.notify = function() {
        F.Taskbar.notify(this.options.process_name, this.options.instance_id);
    };

    FlatOS.UI.Taskbar.prototype.toggleWaiting = function() {
        F.Taskbar.wait(this.options.process_name, this.options.instance_id);
    };

    FlatOS.UI.Taskbar.prototype.setTitle = function(title) {
        F.Taskbar.setTitle(this.options.process_name, this.options.instance_id);
    };

    FlatOS.UI.Taskbar.prototype.is = function() {
        return F.Taskbar.is(this.options.process_name, this.options.instance_id);
    };

    FlatOS.UI.Taskbar.prototype.add = function() {
        F.Taskbar.add(this.options.process_name, this.options.instance_id);
    };

    FlatOS.UI.Taskbar.prototype.remove = function() {
        F.Taskbar.remove(this.options.process_name, this.options.instance_id);
    };

}(jQuery);