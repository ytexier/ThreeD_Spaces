ThreeDSpaces.Museum = function(data) {

	var floors = [];

	this.generate = function() {
		if(data === undefined)
			return;
		for(floor in data.floors) {
			floors.push(new ThreeDSpaces.Floor(floor));
		}
	}

	this.addToScene = function(scene) {
		for(var i = 0; i < floors.length; i++) {
			floors[i].addToScene(scene);
		}
	}
}