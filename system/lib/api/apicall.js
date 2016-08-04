+function($) {

    FlatOS.Api.Call = function(options, callbacks) {

        this.options = $.extend({}, FlatOS.Api.Call.DEFAULTS, options);
        this.callback = null;
        this.progress = null;

        if ($.isFunction(callbacks)) {
            this.callback = callbacks;
            this.progress = null;
        }
        if (typeof callbacks === 'object' && callbacks !== null) {
            this.callback = callbacks.callback || null;
            this.progress = callbacks.progress || null;
        }

    };

    FlatOS.Api.Call.DEFAULTS = {
        call_async: false,
        api_class: '',
        api_method: '',
        api_arguments: []
    };

    FlatOS.Api.Call.prototype.getClass = function() {
        return this.options.api_class;
    };

    FlatOS.Api.Call.prototype.getMethod = function() {
        return this.options.api_class;
    };

    FlatOS.Api.Call.prototype.getArgs = function() {
        return this.options.args;
    };

    FlatOS.Api.Call.prototype.setMethod = function(api_method) {
        this.options.api_method = api_method;
        return this;
    };

    FlatOS.Api.Call.prototype.setArguments = function(api_arguments) {
        this.options.api_arguments = api_arguments;
        return this;
    };

    FlatOS.Api.Call.prototype.call = function() {
        var api  = this;

        var ajax = new FlatOS.Ajax({
            url: 'system/api/apicall.js',
            type: 'post',
            dataType: 'json',
            cache: false,
            async: this.options.call_async,
            xhr: function () {
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        if ($.isFunction(api.progress)) {
                            api.progress(percentComplete);   
                        }
                    }
                }, false);

                return xhr;
            },
            data: { api_class:     this.options.api_class,
                    api_method:    this.options.api_method,
                    api_arguments: this.options.api_arguments },
            success: function(data) {
                if (data.err) {
                    new FlatOS.Notification(data.err_msg);
                    console.error(data.err_msg);
                    console.info(data.err_stack);
                }
                else {
                    if ($.isFunction(api.callback)) {
                        api.callback(data.res);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(api);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });

        ajax.send();
    };

}(jQuery);