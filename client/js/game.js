
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
    this.team = germ.team;
    //TODO this.surroundings = {}
}

function convert_germs(germs, map) {
    var new_germs = [];
    for (var i = 0; i < germs.length; i++) {
        new_germs[i] = new GermState(germs[i], map);
    }
    return new_germs;
}

var Map = function(germs1, germs2, food, size) {
    this.germs1 = germs1;
    this.germs2 = germs2;
    this.food = food;
    this.size = size;

    this.render = funtion() {

        //TODO draw grid
        
        var germs1 = this.germs1;
        var germs2 = this.germs2;
        var food = this.food;

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

    this.get(x, y) {
        var germs1 = this.germs1;
        var germs2 = this.germs2;
        var food = this.food;

        var res = [];

        for (var g1 in germs1) {
            var g = germs1[g1];
            if (x == g.x && y == g.y) {
                res.push(g);
            }
        }
        for (var g2 in germs2) {
            var g = germs2[g2];
            if (x == g.x && y == g.y) {
                res.push(g);
            }
        }
        for (var fi in food) {
            var f = food[fi];
            if (x == f.x && y == f.y) {
                res.push(f);
            }
        }
        return res;
    }
}

var GameServer = function(germs1, germs2, food, AI1, AI2, map_size) {
    this.map = new Map(germs1, germs2, food, map_size);
    this.AI1 = AI1;
    this.AI2 = AI2;
    
    this.render = function() {
        this.map.render();
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
            germ.x += dx;
            germ.y += dy;
            //TODO modify map
        } else if (command["command"] === "split") {
            //TODO
        } 
    }

    this.update = function() {
        var commands1 = this.AI1.get_next_moves(convert_germs(this.map.germs1, this.map));
        var commands2 = this.AI2.get_next_moves(convert_germs(this.map.germs2, this.map));

        for (var i = 0; i < germs1.length; i++) {
            issue_command(commands1[i], germs1[i]);
        }
        for (var i = 0; i < germs2.length; i++) {
            issue_command(commands2[i], germs2[i]);
        }
    }
}

function main() {
    //TODO
}

setInterval(main, 1000/30);

