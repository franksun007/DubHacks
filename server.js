"use strict";
var http = require("http");
var port = process.env.PORT || 8080;

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello fellow hackers");
  response.end();
}).listen(port);
