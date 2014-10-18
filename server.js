var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(express.static(__dirname + '/client/'));
app.use(bodyParser());

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

app.post('/register', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	password = hash(password);
	console.log("register passwd:" + password);
	console.log("making directory " + username);
	dropBox(username, password);

	// fs.mkdir("client/users/" + username, function(err) {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		console.log("creating password.txt");
	// 		fs.writeFile("client/users/" + username + "/password.txt", password, function(err2) {
	// 			if (err2) {
	// 				console.log(err2);
	// 			} else {
	// 				console.log("file written");
	// 			}
	// 		});
	// 	}
	// });
	res.send(req.body);
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
			var passwordInStore = fs.readFile("client/users/" + username + "/password.txt", function(err2){
				if(err2) {
					console.log(err2);
				} else {
					console.log(passwordInStore);
					if (password == passwordInStore){
						res.sendFile(__dirname + '/client/html/index.html');
					} else {
						console.log("wrong password");
					}
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

// DROPBOX CODE
// =============

function dropBox(username, password) {
	var Session = require("temboo/core/temboosession");
	var Utilities = require("temboo/Library/Utilities/Encoding");
	var Dropbox = require("temboo/Library/Dropbox/FilesAndMetadata");
	
	var session = new Session.TembooSession("Germa Codia", "User File Storage Thingy", "faz1ufufxe0v27g");
	
	// Set up the encoding choreo.
	var base64EncodeChoreo = new Utilities.Base64Encode(session);
	// Instantiate and populate the input set for the choreo
	var base64EncodeInputs = base64EncodeChoreo.newInputSet();
	// Set the file's contents. 
	base64EncodeInputs.set_Text(password);
	
	// Execute the choreo to base64 encode your text.
	// If the choreo succeeds, the upload function will be triggered as a callback.
	base64EncodeChoreo.execute(
	    base64EncodeInputs,
	    function(results) {
	        uploadEncodedFile(results.get_Base64EncodedText());
	    },
	    function(error) {
	        console.log(error.type); 
	        console.log(error.message);
	    }
	);

	// Function to call on encode success to upload file to Dropbox.
	function uploadEncodedFile(fileContents) {
	    var uploadFileChoreo = new Dropbox.UploadFile(session);
	    var dateString = new Date().toISOString().replace(/\..+/, '');
	    var fileName = ["users/", username, "/password.txt"].join("");

	    // Instantiate and populate the input set for the choreo
	    var uploadFileInputs = uploadFileChoreo.newInputSet();
	    // Set to the name of the Profile you created earlier in the tutorial
	    uploadFileInputs.setCredential("Germacodia");

	    // Set inputs.
	    uploadFileInputs.set_FileName(fileName);
	    uploadFileInputs.set_FileContents(fileContents);

	    // Run the choreo, specifying success and error callback handlers.
	    uploadFileChoreo.execute(
	        uploadFileInputs,
	        function(results){
	            console.log(results.get_Response());
	        },
	        function(error) {
	            console.log(error.type); 
	            console.log(error.message);
	        }
	    );
	}
}
