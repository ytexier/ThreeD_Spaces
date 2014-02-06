ThreeDSpaces.Floor = function(data) {

	if(data === undefined)
		return;

	var rawWalls = data.walls;
	var rawObjects = data.objects;

	var r = data.r;
	var walls = [];
	var objects = [];

	this.generate = function() {
		for(wall in rawWalls) {
			walls.push(new ThreeDSpaces.Wall(wall));
		} 
		for(object in rawObjects) {
			objects.push(new ThreeDSpaces.Model(object));
		}
	}

	this.generateLight = function() {

	}

	this.addToScene = function(scene) {
		for(var i = 0; i < walls.length; i++) {
			walls[i].addToScene(scene);
		}
		for(var i = 0; i < objects.length; i++) {
			objects[i].addToScene(scene);
		}
	}

}