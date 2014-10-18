hi there
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello fellow hackers");
  response.end();
}).listen(80);
