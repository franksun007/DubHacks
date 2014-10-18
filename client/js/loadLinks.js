(function() {
	window.onload = function() {
		var request = new XMLHttpRequest();
		request.open("GET", "links.txt", true);
		request.send();
		request.onload = injectLinks;
		document.getElementById("battle").onclick = battle;
	}

	function injectLinks() {
		var links = this.responseText.split(",");
		var linkDropDown = document.getElementById("links");
		for (var i = 0; i < links.length; i++) {
			var link = document.createElement("option");
			link.innerHTML = links[i];
			linkDropDown.appendChild(link);
		}
	}

	function battle() {
		window.location = "battle/" + document.getElementById("links").value;
	}


})();