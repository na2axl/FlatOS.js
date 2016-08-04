var http = require('http');
var FlatOS = require('./system/kernel/Kernel');

function onRequest(request, response) {
    console.log(request.url);
    response.writeHead(200, { "Content-type": "text/html" });
    response.write(FlatOS.load('UserInterface').render());
    response.end();
}

http.createServer(onRequest).listen(8000);

console.log("Server is running...");