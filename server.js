var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(express.static(__dirname + '/client/'));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'secretcookieooooooooh2spooky'}));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/html/index_unlogin.html');
});

app.get('/form', function (req, res) {
	res.sendFile(__dirname + '/client/html/form.html');
});

app.get('/login.html', function (req, res) {
	res.sendFile(__dirname + '/client/html/login.html');
});

app.get('/register.html', function (req, res) {
	res.sendFile(__dirname + '/client/html/register.html');
});

app.get('/index.html', function (req, res) {
	res.sendFile(__dirname + '/client/html/index.html');
});

app.post('/register', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var rePassword = req.body.rePassword;
	console.log("fields set");
	if (password == rePassword) {
		console.log("hooray!");
	} else {
		res.redirect("register.html");
	}
	password = hash(password);
	console.log("register passwd:" + password);
	console.log("making directory " + username);

	fs.mkdir("client/users/" + username, function(err) {
		if (err) {
			console.log(err);
			res.redirect("register.html");
		} else {
			console.log("creating password.txt");
			fs.writeFile("client/users/" + username + "/password.txt", password, function(err2) {
				if (err2) {
					console.log(err2);
					res.redirect("register.html");
				} else {
					console.log("file written");
					res.redirect("login.html");
				}
			});
		}
	});
});

app.post('/submit', function (req, res){
	var username = req.session.username;
	var code = req.body.code;
	console.log("fields set");
	fs.writeFile("/client/users/" + username + "/AI.js", code, function (err) {
		if(err) {
			console.log(err);
		} else {
			console.log("file written");
		}
	});
});

app.post('/verify', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	password = hash(password);
	console.log("verify passwd:" + password);
	fs.readdir("client/users/" + username, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("checking the password");
			fs.readFile("client/users/" + username + "/password.txt",'utf8', function(err2, data){
				if(err2) {
					console.log(err2);
				} else {
                    console.log(password);
                    console.log(data);
					if (password == data) {
                        res.redirect('index.html');
                        req.session.username = username;
                        console.log("stored " + req.session.username);
					} else {
						console.log("wrong password");
                        res.redirect("login.html");
					}
				}
			});
		}
	}); 
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

