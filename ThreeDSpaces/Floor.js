ThreeDSpaces.Floor = function(data) {

	if(data === undefined)
		return;

	console.log("floor");

	var rawWalls = data.walls;
	var rawObjects = data.objects;

	var r = data.r;
	var walls = [];
	var objects = [];

	this.generate = function() {
		for(var i = 0; i < rawWalls.length; i++) {
			console.log(rawWalls[i]);
			walls.push(new ThreeDSpaces.Wall(rawWalls[i]));
		} 
		for(object in rawObjects) {
			objects.push(new ThreeDSpaces.Model(object));
		}
	}

	this.generateLight = function() {

	}

	this.generateGround = function()) {

	}

	this.addToScene = function(scene) {
		for(var i = 0; i < walls.length; i++) {
			walls[i].addToScene(scene);
		}
		for(var i = 0; i < objects.length; i++) {
			objects[i].addToScene(scene);
		}
	}

	this.generate();

}