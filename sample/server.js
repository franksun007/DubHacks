
var express = require("express");

var compression = require("compression");
var favicon = require("serve-favicon");

var app = express();

app.set("view engine", "jade");

app.use(favicon(__dirname + '/public/img/favicon.ico'));

//static middleware
var oneDay = 86400000;
app.use(compression());
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.get("/", function(req, res){
  res.render("index");
});

app.get("/application",function(req, res){
  res.sendfile("./public/files/application.docx");
});

app.get("*", function(req, res){
  res.render("notFound");
});

var server = app.listen(3000, function(){
  console.log("Listening on port %d", server.address().port);
});