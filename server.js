var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(express.static(__dirname + '/client/'));
app.use(bodyParser());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/html/login.html');
});

app.get('/form', function (req, res) {
	res.sendFile(__dirname + '/client/html/form.html');
});

app.post('/verify', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	fs.mkdir(username, function(err) {
		if (err) {
			console.log(err);
		} else {
			fs.open("password.txt", "w+", function(err2) {
				if (err2) {
					console.log(err2);
				} else {
					fs.writeFile("password.txt", password, function(err3) {
						console.log("file written");
					});
				}
			});
		}
	});
	res.send(req.body);
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Listening on port 8080" );
});

