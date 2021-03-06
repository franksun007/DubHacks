var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var handlebars = require("handlebars");
var vm = require('vm');

app.use(express.static(__dirname + '/client/'));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'secretcookieooooooooh2spooky'}));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/html/index_unlogin.html');
});

app.get('/client/users/:username/:AI/:num', function (req, res) {
    fs.readFile('client/users/' + req.params.username + "/" + req.params.AI,'utf8', function(err, data) {
        data = "var AI" + req.params.num + " = " + data;
        res.send(data);
    });
});

app.get('/form', function (req, res) {
	res.sendFile(__dirname + '/client/html/form.html');
});

app.get('/login.html', function (req, res) {
	res.sendFile(__dirname + '/client/html/login.html');
});

app.get('/battle/:enemy', function(req, res) {
    fs.readFile('client/html/battle.html', 'utf8', function(err, data) {
        var template = handlebars.compile(data);
        console.log(req.session.username);
        var stuff = {'myname':req.session.username, 'enemy':req.params.enemy};
        var result = template(stuff);
        res.send(result);
    });
});

app.get('/register.html', function (req, res) {
	res.sendFile(__dirname + '/client/html/register.html');
});

app.get('/index.html', function (req, res) {
	res.sendFile(__dirname + '/client/html/index.html');
});

app.get('/indexj.html', function (req, res) {
	res.sendFile(__dirname + '/client/html/indexj.html');
});

app.get('/js/:filename', function(req, res) {
    res.sendFile('client/js/' + req.params.filename);
});

app.get('/loadLinks.js', function (req, res) {
	res.sendFile(__dirname + '/client/js/loadLinks.js');
});

app.get('/links.txt', function (req, res) {
	console.log(__dirname + '/server/links.txt');
	res.sendFile(__dirname + '/server/links.txt');
});

app.get('/select', function (req, res) {
	fs.readdir('client/users/', function (err, links) {
		if (err) {
			console.log(err);
		} else {
			fs.readFile('client/html/select.html', 'utf8', function(err, data) {
		        var template = handlebars.compile(data);
		        console.log(req.session.username);
				var stuff = {"usernames":links};
		        var result = template(stuff);
		        res.send(result);
  			});
		}
	});
});

// for registration
app.post('/register', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var rePassword = req.body.rePassword;
	console.log("fields set");
	if (password != rePassword) {
		res.sendFile(__dirname + "/client/html/register.html");
	} else {
		console.log("hooray!");
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
	}
});


// for turning in js code
app.post('/submit', function (req, res){
	if (req.session.username) {
		var username = req.session.username;
	} else {
		console.log("no cookie set");
	}
	var code = req.body.userCode;
	console.log("fields set");
	fs.writeFile("client/users/" + username + "/AI.js", code, function (err) {
		if(err) {
			console.log(err);
			redirect("failure.html"); 
		} else {
			console.log("file written");
			res.redirect("/select");
		}	
	});

});

// for login
app.post('/verify', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	password = hash(password);
	console.log("verify passwd:" + password);
	fs.readdir("client/users/" + username, function(err) {
		if(err) {
			console.log(err);
			res.redirect("login.html");
		} else {
			console.log("checking the password");
			fs.readFile("client/users/" + username + "/password.txt",'utf8', function(err2, data){
				if(err2) {
					console.log(err2);
				} else {
                    console.log(password);
                    console.log(data);
					if (password == data) {
                        req.session.username = username;
                        console.log("stored " + req.session.username);
                        res.redirect('index.html');
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

