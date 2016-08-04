(function($) {

    var _w = new FlatOS.Window('_flatos_alert_dialog'),
        _a = new FlatOS.Application({
            process_name: '_flatos_alert_dialog',
            isSystemApp: true
        });
    
    var instance = _w.getInstanceID(),
        $_w = _w.get();
        
    $_w.find('img.alert_window_icon_img').attr('src', _a.getURI() + '/icon.svg');
    
})(jQuery);