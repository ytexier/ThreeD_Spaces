ThreeDSpaces.Model =  function(data) {

	if(data === undefined)
		return;

	var posX = data.posX;
	var posZ = data.posZ;

	this.generate = function() {

	}

	this.addToScene = function(scene) {
		scene.add(this);
	}

	this.generate();

}