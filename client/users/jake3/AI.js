{
    "get_next_moves": function(germs) {
        var command = [];
        for (var i; i < germs.length; i++) {
            // surroundings = {"left" : "", "right": "", "up" : "", "down" : ""};
            if(germs[i].surroundings["up"] === "food") {
                command[i] = {"command":"move", "direction":"up"};
            }
            else if(germs[i].surroundings["right"] === "food") {
                command[i] = {"command":"move", "direction":"right"};
            }
            else if(germs[i].surroundings["left"] === "food") {
                command[i] = {"command":"move", "direction":"left"};
            }
            else if(germs[i].surroundings["down"] === "food") {
                command[i] = {"command":"move", "direction":"down"};
            }
            else if(germs[i].surroundings["right"] === "enemy") {
                command[i] = {"command":"move", "direction":"left"};
            }
            else if(germs[i].surroundings["left"] === "enemy") {
                command[i] = {"command":"move", "direction":"right"};
            }
            else if(germs[i].surroundings["up"] === "enemy") {
                command[i] = {"command":"move", "direction":"down"};
            }
            else if(germs[i].surroundings["down"] === "enemy") {
                command[i] = {"command":"move", "direction":"up"};
            }
            else {
                var direction = ["left", "right", "up", "down"];
                var index = parseInt(Math.random() * 4);
                command[i] = {"command":"split", "direction": direction[index]};
            }
        }
        return command;
    }

}/**
 * Created by admin on 10/18/2014.
 */
