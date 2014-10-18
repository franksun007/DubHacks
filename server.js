var express = require('express');
var app = express();

app.use(express.static(__dirname + '/client/'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/html/index.html');
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Listening on port 8080" );
});

