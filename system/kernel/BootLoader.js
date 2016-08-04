// Loading the Kernel
const FlatOS = require('./Kernel');

/**
 * BootLoader
 *
 * Load FlatOS and initialize environment.
 *
 * @author      Axel Nana
 * @package     FlatOS
 * @subpackage  System
 * @constructor
 */
var BootLoader = function () {};

/**
 * Boots the OS
 *
 * @return {void}
 */
BootLoader.prototype.boot = function () {
    // Initialize sessions
    var user = FlatOS.load('User');
    var isSession = user.isSession();

    // Used for testing...
    // REMOVE IT FOR DEPLOYMENT
    if (isSession) {
        user.setSessionValue('username', null);
    }

    // Initialize interface
    var ui = FlatOS.load('UserInterface');
    var layout = ui.render();

    // Initialize server
    this._server(layout);
};

/**
 * Loads the server
 *
 * @return {void}
 */
BootLoader.prototype._server = function (layout) {
    // Loading server requirements
    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var debug = require('debug')('FlatOS:server');
    var http = require('http');

    // Loading the environment
    var app = express();

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '1000mb'}));
    app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));
    app.use(cookieParser());

    // Initialize route to apicall.js for POST requests
    app.post('/system/api/apicall.js', function (request, response) {
        FlatOS.load('HTTPRequest').setGET(require('querystring').parse(require('url').parse(request.originalUrl).query));
        FlatOS.load('HTTPRequest').setPOST(request.body);
        var api = require('../api/apicall');
        response.status(200).json(api.result());
    });

    // Applying global behaviour to all routes with GET request
    app.get('*', function (request, response) {
        FlatOS.load('HTTPRequest').setGET(require('querystring').parse(require('url').parse(request.originalUrl).query));
        FlatOS.load('HTTPRequest').setPOST(request.body);
        var path = require('url').parse(request.originalUrl).pathname.split('%20').join(' ');
        if (FlatOS.load('FS').exists("." + path) && !FlatOS.load('FS').isDir("." + path)) {
            FlatOS.load('RawDataCall').render(request, response);
        }
        else if (FlatOS.load('FS').isDir("." + path) && FlatOS.load('FS').exists("." + path + "/index.html")) {
            request.originalUrl += '/index.html';
            FlatOS.load('RawDataCall').render(request, response);
        }
        else if (path === '/') {
            response.status(200).type("html");
            response.send(layout);
        }
        else {
            response.status(404).end();
        }
    });

    // Getting the port
    var port = normalizePort(process.env.PORT || '8000');
    app.set('port', port);

    // Creates server
    var server = http.createServer(app);

    // Listening on the chosen port
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    // Used to normalize the port
    function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    // Used to handler `error` event
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    // Used to handle `listening` event
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }

};

// Exports the module
module.exports = new BootLoader();
