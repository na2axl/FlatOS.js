(function ($) {

    var _w = new FlatOS.Window('flatos_breakersgame'),
        _a = new FlatOS.Application('flatos_breakersgame');

    _w.on('init', function () {
      _w.get().find("#breakersgameframe").attr('src', _a.getURI() + '/game/game.html');
    });

})(jQuery);
