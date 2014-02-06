/**
 * [Wall description]
 * @param {[type]} data [description]
 */
ThreeDSpaces.Wall = function (data) {
	if(data == undefined)
		return;

	var _object;
	var width = data.width;
	var height = data.height;
	var depth = data.depth;

	var posX = data.posX;
	var posY = data.posY;
	var posZ = data.posZ;

	var angle = data.rotation;
	var texture = data.texture;

	var _doors = data.doors;
	var _windows = data.windows;
	var _paintings = data.paintings;

	/**
	 * [generate description]
	 * @return {[type]} [description]
	 */
	this.generate = function() {
		var wall_texture = new THREE.ImageUtils.loadTexture(texture);
        var wall_material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture});
		var wall_geometry = new THREE.CubeGeometry(width, height, depth);

		var wall_mesh = new Physijs.BoxMesh(wall_geometry, wall_material, 0);
		object = wall_mesh;

		generate_doors(_doors);
		generate_windows(_windows);
		generate_paintings(_paintings);

		
	}

	/**
	 * [generate_doors description]
	 * @param  {[type]} doors [description]
	 * @return {[type]}       [description]
	 */
	this.generate_doors = function(doors) {
		var result;
		for(door in doors) {
			var wall_bsp = new ThreeBSP(this.getObject());
			var door_geometry = new THREE.CubeGeometry(door.width, door.height, object.z);
			var door_material = new THREE.MeshBasicMaterial({color: 0xffffff});
			var door_mesh = new Physijs.BoxMesh(door_geometry, door_material, 0);
			var door_bsp = new ThreeBSP(door_mesh);
			var wall_substract = wall_bsp.subtract(door_bsp);
			var result = wall_substract.toMesh(new THREE.MeshBasicMaterial({color: 0xffffff, map: texture}));
			result.geometry.computeVertexNormals();
			_object = result;
		}
	}

	/**
	 * [generate_windows description]
	 * @param  {[type]} windows [description]
	 * @return {[type]}         [description]
	 */
	this.generate_windows = function(windows) {

	}

	/**
	 * [generate_paintings description]
	 * @param  {[type]} paintings [description]
	 * @return {[type]}           [description]
	 */
	this.generate_paintings = function(paintings) {

	}

	/**
	 * [getObject description]
	 * @return {[type]} [description]
	 */
	this.getObject = function() {
		return object;
	}

	/**
	 * [setObject description]
	 * @param {[type]} object [description]
	 */
	this.setObject = function(object){
		_object = object;
	}
}