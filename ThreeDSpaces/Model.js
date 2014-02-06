ThreeDSpaces.Model =  function(data) {

	var posX = data.posX;
	var posZ = data.posZ;

	this.generate = function() {

	}

	this.addToScene = function(scene) {
		scene.add(this);
	}

}