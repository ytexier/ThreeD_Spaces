ThreeDSpaces.Museum = function(data) {

	if(data === undefined)
		return;

	var rawFloors = data.floors;
	var floors = [];

	this.generate = function() {
		for(floor in rawFloors) {
			floors.push(new ThreeDSpaces.Floor(floor));
		}
	}

	this.addToScene = function(scene) {
		for(var i = 0; i < floors.length; i++) {
			floors[i].addToScene(scene);
		}
	}
}