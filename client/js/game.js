
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var Germ = function(x, y, health, team) {
    this.x = x;
    this.y = y;
    this.health = health;

    this.render = function() {
        ctx.fillStyle = "#0F0";
        ctx.fillRect(this.x, this.y, 20, 20);
    }
}

var GermState = function(germ, map) {
    this.x = germ.x;
    this.y = germ.y;
    this.health = germ.health;
    //TODO this.surroundings = {}
}

var GameServer = function(germs1, germs2, food, AI1, AI2, map_size) {
    this.germs1 = germs1;
    this.germs2 = germs2;
    this.food = food;
    this.AI1 = AI1;
    this.AI2 = AI2;
    this.map_size = map_size;
    
    this.render = funtion() {



        ctx.fillStyle = "#0FF";
        ctx.fillRect(0,0,WIDTH,HEIGHT);

        for (var i = 0; i < germs1.length; i++) {
            germs1[i].render();
        }
        for (var i = 0; i < germs2.length; i++) {
            germs2[i].render();
        }

        for (var i = 0; i < food.length; i++) {
            food[i].render();
        }
    }

    this.update = function() {
        var commands1 = AI1.get_next_moves(convert_germs(germs1));
        var commands2 = AI2.get_next_moves(convert_germs(germs2));

        for (var i = 0; i < germs1.length; i++) {
            issue_command(commands1[i], germs1[i]);
        }
        for (var i = 0; i < germs2.length; i++) {
            issue_command(commands2[i], germs2[i]);
        }
    }
}

var AI = function() {
    this.get_next_moves = function(germs) {
        
    }
}

function main() {
    
}

setInterval(render, 1000/30);

