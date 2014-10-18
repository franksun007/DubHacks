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
	password = hash(password);
	console.log("making directory " + username);
	fs.mkdir("client/users/" + username, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("creating password.txt");
			fs.writeFile("client/users/" + username + "/password.txt", password, function(err2) {
				if (err2) {
					console.log(err2);
				} else {
					console.log("file written");
				}
			});
		}
	});
	res.send(req.body);
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Listening on port 8080" );
});

function hash(string) {
	var hash = 0, i, chr, len;
	if (string.length == 0) {
  		return hash;	
	}
 	for (i = 0, len = string.length; i < len; i++) {
	    chr   = string.charCodeAt(i);
	    hash  = ((hash << 5) - hash) + chr;
	    hash |= 0; // Convert to 32bit integer
 	}
  	return hash;
}

