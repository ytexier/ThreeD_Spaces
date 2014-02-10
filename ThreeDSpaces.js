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

	this.generateGround = function() {

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

/**
 * [Wall description]
 * @param {[type]} data [description]
 */
ThreeDSpaces.Wall = function (data) {
	if(data === undefined)
		return;

	/**
	 * rawObject: THREE.Mesh
	 * physiObject: Physijs.BoxMesh
	 * currentGeometry: THREE.CubeGeometry
	 */
	var rawObject, physiObject, currentGeometry;
	var wall_texture, wall_material;
	var door_material, door_geometry, door_mesh;

	var sc = scene;
	
	var width = data.width;
	var height = data.height;
	var depth = data.depth;

	var posX = data.posX;
	var posY = data.posY;
	var posZ = data.posZ;

	var angle = data.angle;
	var texture = data.texture;

	var rawDoors = data.doors;
	var rawWindows = data.windows;
	var rawPaintings = data.paintings;

	/**
	 * [generate description]
	 * @return {[type]} [description]
	 */
	this.generate = function() {
		wall_texture = new THREE.ImageUtils.loadTexture(texture);
        wall_material = new THREE.MeshBasicMaterial({color: 0xffffff, map: wall_texture});
		
		currentGeometry = new THREE.CubeGeometry(width, height, depth);

		var basic_wall_mesh = new THREE.Mesh(currentGeometry, wall_material);
		basic_wall_mesh.overdraw = true;
		basic_wall_mesh.position.x = posX;
		basic_wall_mesh.position.z = posZ;

		basic_wall_mesh.rotation.y = angle;

		rawObject = basic_wall_mesh;

		this.generate_doors(rawDoors);
		this.generate_windows(rawWindows);
		this.generate_paintings(rawPaintings);

		var wall_mesh = new Physijs.BoxMesh(currentGeometry, wall_material, 0);
		wall_mesh.position.x = posX;
		wall_mesh.position.z = posZ;
		wall_mesh.rotation.y = angle;
		physiObject = wall_mesh;
		
	}

	/**
	 * [generate_doors description]
	 * @param  {[type]} doors [description]
	 * @return {[type]}       [description]
	 */
	this.generate_doors = function(doors) {
		for(var i = 0; i < rawDoors.length; i++) {
			
			door_geometry 
				= new THREE.CubeGeometry(rawDoors[i].width, rawDoors[i].height, rawObject.position.z);
			door_material = new THREE.MeshBasicMaterial({color: 0xffffff});
			door_mesh = new THREE.Mesh(door_geometry, wall_material);
			door_mesh.position.x = rawDoors[i].posX;
			//door_mesh.position.y = rawObject.y;
			door_mesh.position.z = rawDoors[i].posZ;
			door_mesh.rotation.y = angle;

			var wall_bsp = new ThreeBSP(this.getObject());
			var door_bsp = new ThreeBSP(door_mesh);
			var wall_substract = wall_bsp.subtract(door_bsp);

			currentGeometry = wall_substract.toGeometry();

			var result = wall_substract.toMesh(wall_material);
			result.geometry.computeVertexNormals();

			rawObject = result;
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
		return rawObject;
	}

	/**
	 * [setObject description]
	 * @param {[type]} object [description]
	 */
	this.setObject = function(object) {
		rawObject = object;
	}


	this.addToScene = function(scene) {
		scene.add(physiObject);
	}

	this.generate();
}

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