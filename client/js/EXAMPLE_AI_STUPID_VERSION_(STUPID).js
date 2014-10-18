function() {
	this.get_next_moves = function(germs) {
		var command = [];
		for (var i; i < germs.length; i++) {
			// surroundings = {"left" : "", "right": "", "up" : "", "down" : ""};
			var direction = {"left", "right", "up", "down"};
			var action = {"move", "split"};
			var actionindex = parseInt(Math.random() * 2);
			var directionindex = parseInt(Math.random() * 4);
			command[i] = {"command":action[actionindex], "direction": direction[directionindex]};
		}
		return command;
	}

}