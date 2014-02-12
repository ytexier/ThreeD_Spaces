var ThreeDSpaces = { rev: '0.1' }; 

ThreeDSpaces.Museum = function(data) {

	if(data === undefined)
		return;

	console.log("museum");
	console.log(data.name);
	console.log(data.floors);

	var rawFloors = data.floors;
	var floors = [];

	this.generate = function() {
		for(var i = 0; i < rawFloors.length; i++) {
			console.log(rawFloors[i]);
			floors.push(new ThreeDSpaces.Floor(rawFloors[i]));
		}
	}

	this.addToScene = function(scene) {
		for(var i = 0; i < floors.length; i++) {
			floors[i].addToScene(scene);
		}
	}

	this.generate();
}