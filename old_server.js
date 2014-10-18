"use strict";
var http = require("http");
var port = process.env.PORT || 8080;

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello fellow hackers, ZUP \n\n");
  response.write("This is the coolest moment of our lives \n\n");
    response.write("What we need to do.. \n\n");
    response.write("Is being awesome! \n\n");
    response.write("And \n\n");
    response.write("BE A SWAG \n\n");
    response.write("OR SWAGS  \n\n");
  response.end();
}).listen(port);

