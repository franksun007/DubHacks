
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var SIZE = 20;

var Germ = function(x, y, health, team) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.team = team;

    this.render = function() {
        //TODO replace with image
        if (team == 1) {
            ctx.fillStyle = "#0F0";
        } else {
            ctx.fillStyle = "#00F";
        }
        ctx.fillRect(this.x*SIZE, this.y*SIZE, SIZE, SIZE);
    }
};

var Food = function(x, y) {
    this.x = x;
    this.y = y;
    this.eaten = false;

    this.render = function() {
        ctx.fillStyle = "#FFF";
        ctx.fillRect(this.x*SIZE, this.y*SIZE, SIZE, SIZE);
    };
};

function to_string(thing, team) {
    if (thing instanceof Germ) {
        if (thing.team == team) {
            return "ally";
        } else {
            return "enemy";
        }
    } else if (thing instanceof Food) {
        return "food";
    } else {
        return "";
    }
}

var GermState = function(germ, map) {
    this.x = germ.x;
    this.y = germ.y;
    this.health = germ.health;
    this.team = germ.team;
    
    this.surroundings = {};
    this.surroundings["left"] = to_string(map.get(this.x - 1, this.y)[0]);
    this.surroundings["right"] = to_string(map.get(this.x + 1, this.y)[0]);
    this.surroundings["up"] = to_string(map.get(this.x, this.y - 1)[0]);
    this.surroundings["down"] = to_string(map.get(this.x, this.y + 1)[0]);
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
    that = this;

    this.render = function() {
        //TODO draw grid
        
        var germs1 = this.germs1;
        var germs2 = this.germs2;
        var food = this.food;

        ctx.fillStyle = "#000";
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
    };

    this.get = function(x, y) {
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
    };
}

var GameServer = function(germs1, germs2, food, AI1, AI2, map_size) {
    this.map = new Map(germs1, germs2, food, map_size);
    this.AI1 = AI1;
    this.AI2 = AI2;
    var that = this;
    
    this.render = function() {
        that.map.render();
    };

    this.issue_command = function(command, germ) {
        var dx = 0;
        var dy = 0;
        if (!command) return false;
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
        } else if (command["command"] === "split") {
            if (germ.health >= 2) {
                germ.health = germ.health / 2;
                return new Germ(germ.x + dx, germ.y + dy, germ.health / 2, germ.team);
            }
        } 
        return false;
    };

    this.update = function() {
        var germs1 = that.map.germs1;
        var germs2 = that.map.germs2;

        var commands1 = that.AI1.get_next_moves(convert_germs(germs1, that.map));
        var commands2 = that.AI2.get_next_moves(convert_germs(germs2, that.map));


        for (var i = 0; i < germs1.length; i++) {
            var new_guy = that.issue_command(commands1[i], germs1[i]);
            if (new_guy) germs1.push(new_guy);
        }
        that.handle_overlaps(germs1, germs2);
        for (var i = 0; i < germs2.length; i++) {
            var new_guy = that.issue_command(commands2[i], germs2[i]);
            if (new_guy) germs2.push(new_guy);
        }
        that.handle_overlaps(germs2, germs1);
        that.render();
    };

    this.handle_overlaps = function(my_germs, enemy_germs) {
        var germs1 = my_germs;
        var germs2 = enemy_germs;
        var food = this.map.food;
        for (var i = 0; i < germs1.length; i++) {
            for (var j = 0; j <germs2.length; j++) {
                if (germs1[i].x == germs2[j].x && germs1[i].y == germs2[j].y) {
                    fight(germs1[i], germs2[j]);
                }

            }

            for (var k = 0; k < food.length; k++) {
                if (germs1[i].x == food[k].x && germs1[i].y == food[k].y) {
                    eat(germs1[i], food[k]);
                }
            }
        }
        for (var i = 0; i < food.length; i++) {
            if (food[i].eaten) {
                food.splice(i, 1);
            }
        }

        for (var i = 0; i < germs1.length; i++) {
            if (germs1[i].health <= 0) {
                germs1.splice(i, 1);
            }
        }
        for (var i = 0; i < germs2.length; i++) {
            if (germs2[i].health <= 0) {
                germs2.splice(i, 1);
            }
        }
    };
};

function fight(germ1, germ2) {
    if (germ1.health > germ2.health) {
        germ1.health -= germ2.health;
        germ2.health = 0;
    } else if (germ1.health < germ2.health) {
        germ2.health -= germ1.health;
        germ1.health = 0;
    } else {
        germ1.health = 0;
        germ2.health = 0;
    }
}

function eat(germ, food) {
   food.eaten = true;
   germ.health += 50;
}

// Some test data for testing
var g1 = [new Germ(10,10,100,1),new Germ(10,15,100,1),new Germ(10,17,100,1)];
var g2 = [new Germ(15,10,100,2),new Germ(15,15,100,2),new Germ(15,17,100,2)];
var some_food = [new Food(5, 5)];
var first_AI = {
    "get_next_moves": function(germs) {
        var command = [];
        for (var i = 0; i < germs.length; i++) {
            var direction = ["left", "right", "up", "down"];
            var action = ["move", "split"];
            var actionindex = parseInt(Math.random() * 2);
            var directionindex = parseInt(Math.random() * 4);
            command[i] = {"command":action[actionindex], "direction": direction[directionindex]};
        }
        return command;
    }
};
var second_AI = {
    "get_next_moves": function(germs) {
        var command = [];
        for (var i = 0; i < germs.length; i++) {
            var direction = ["left", "right", "up", "down"];
            var action = ["move", "split"];
            var actionindex = parseInt(Math.random() * 2);
            var directionindex = parseInt(Math.random() * 4);
            command[i] = {"command":action[actionindex], "direction": direction[directionindex]};
        }
        return command;
    }
};
 
var gs = new GameServer(g1, g2, some_food, first_AI, second_AI, 20);

setInterval(gs.update, 1000/30);

