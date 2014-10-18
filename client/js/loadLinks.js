(function() {
	window.onload = function() {
		document.getElementById("battle").onclick = battle;
	}

	

	function battle() {
		window.location = "battle/" + document.getElementById("links").value;
	}


})();