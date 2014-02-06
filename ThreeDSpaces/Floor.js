ThreeDSpaces.Floor = function(data) {

	var r = data.r;
	var walls = [];
	var objects = [];

	this.generate = function() {
		for(wall in data.walls) {
			walls.push(new ThreeDSpaces.Wall(wall));
		} 
		for(object in data.objects) {
			objects.push(new ThreeDSpaces.Model(object));
		}
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