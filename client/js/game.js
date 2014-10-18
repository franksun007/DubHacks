
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

ctx.fillStyle = "#000";
ctx.fillRect(0,0,WIDTH,HEIGHT);
ctx.fillStyle = "#F00";
ctx.fillRect(20, 20, 50, 10);
