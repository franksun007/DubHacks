
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var Germ = function(x, y, health, team) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.team = team;

    this.render = function() {
        //TODO replace with image
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

function convert_germs(germs, map) {
    var new_germs = [];
    for (var i = 0; i < germs.length; i++) {
        new_germs[i] = new GermState(germs[i], map);
    }
    return new_germs;
}

var GameServer = function(germs1, germs2, food, AI1, AI2, map_size) {
    this.germs1 = germs1;
    this.germs2 = germs2;
    this.food = food;
    this.AI1 = AI1;
    this.AI2 = AI2;
    
    this.map = [];
    for (var i = 0; i < map_size; i++) {
        this.map[i] = [];
        for (var j = 0; j < map_size; j++) {
            this.map[j] = []; // this array will hold all the shit at this position
            for (var g1 in germs1) {
                var g = germs1[g1];
                if (i == g.x && j == g.y) {
                    this.map[j].push(g);
                }
            }
            for (var g2 in germs2) {
                var g = germs2[g2];
                if (i == g.x && j == g.y) {
                    this.map[j].push(g);
                }
            }
        }
    }
    
    this.render = funtion() {

        //TODO draw grid

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

    this.issue_command = function(command, germ) {
        var dx = 0;
        var dy = 0;
        if (command["direction"] === "up") {
            dy = -1;
        }
        else if (command["direction"] === "down") {
            dy = 1;
        }
        else if (command["direction"] === "left") {
            dx = -1;
        }
        else if (command["direction"] === "right") {
            dx = 1;
        }

        if (command["command"] === "move") {
        } else if (command["command"] === "split") {

        } 
    }

    this.update = function() {
        var commands1 = AI1.get_next_moves(convert_germs(germs1, this.map));
        var commands2 = AI2.get_next_moves(convert_germs(germs2, this.map));

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

