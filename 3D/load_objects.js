function load_objects(path) {
	$.getJSON(path, function(data) {
	//data.museum
	//data.floor: generate_floor();
	/**
	 * data.museum
	 * data.floor -> 
	 * generate_floor(floor) {
	 * 	(for wall in floor) {
	 * 		generate_wall(wall);	
	 * 	}
	 * 	for(object in floor) {
	 * 		place_object(object);
	 * 	}
	 * }
	 *
	 * data.wall ->
	 * generate_wall(length, height, width, posX, posY, posZ, rotation, texture, wall.doors, wall.windows, wall.paintings) {
	 * 	new cube(l, h, w, x, y, z, a, texture);
	 * 	for(door in doors) {
	 * 		cube -> create_door(door);
	 * 	}
	 * 	for(window in windows) {
	 * 		cube -> create_window(window);
	 * 	}
	 * 	for(painting in paintings) {
	 * 		cube -> attach_painting(painting);
	 * 	}
	 * }
	 */
});
}