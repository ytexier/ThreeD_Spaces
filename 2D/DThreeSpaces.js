var DThreeSpaces = { rev: '0.1' };

var WIDTH_MIN_WALL = 15;

var currentGrid ;

var depthWall = 8;
var heightWall = 100;

var objectWidth = 40;
var objectHeight = 40;

var isAfterDrag = false;  
var firstMouseOver = true;

var doorWidth=30;
var doorDepth=10;
var paintingWidth=60;

var doorLocked = false; //after checkColides = true, when a red door is put on a wall

/***
 ** CONTAINER
 ******
 ****
 **/
DThreeSpaces.Container = function(name){

    var name = name;
    var grids = [];
    var currentGridIndex = 0;
    var currentItem = "";
    var currentObject = "";

    this.setVisibleGrid = function(indexGrid){
        grids[indexGrid].setVisible();
    }
    this.setHiddenGrid = function(indexGrid){
        grids[indexGrid].setHidden();
    }
    this.addGrid = function(width, height, depth, r, texture){
        grids.push(new DThreeSpaces.Grid(this, width, height, depth, r, texture));
    }
    this.getGrids = function(){
        return grids;
    }
    this.getLength = function(){
        return grids.length;
    }
    this.setCurrentGrid = function(index){
        currentGridIndex = index;
        currentGrid = grids[currentGridIndex];
    }
    this.cleaning = function(){
        return grids[currentGridIndex].cleaning();
    }
    this.setCurrentObject = function(model){
        currentObject = model;
    }
    this.getCurrentObject = function(){
        return currentObject;
    }
    this.getCurrentGrid = function(){
        return currentGridIndex;
    }
    this.setCurrentItem = function(item){
        currentItem = item;
    }
    this.getCurrentItem = function(){
        return currentItem;
    }
    this.removeGrid = function(index){
        if(grids.length > 0)
            grids.splice(index, 1);
    }

    this.toJson = function(){
        var json = '{"name":"'+name+'"';

        json += ', "floors": [';
        if(grids.length>0){
            for(var i=0; i<grids.length; i++)
                json += grids[i].toJson().concat(',');
            json = json.slice(0, json.lastIndexOf(','));
        }
        json += ']';

        return json.concat('}');
    }
}


/***
 ** GRID
 ******
 ****
 **/
DThreeSpaces.Grid = function(container, widthGrid, heightGrid, depth, r, texture) {

    var widthGrid = widthGrid;
    var heightGrid = heightGrid;
    var depth = depth;
    var r = r;

    var container = container;

    var walls = [];
    var objects = [];
    var paintings = [];
    var doors = [];

    var firstClick = true;
    var tempPositions = [];

    var firstClickX;
    var firstClickY;
    var onWall=false;

    /*
    * Set with and heigh of the SVG canvas
    */
   
    var svgGrid = d3.select("#grid")
        .append("svg:svg")
        .attr("width", widthGrid) //Set width of the SVG canvas
        .attr("height", heightGrid) //Set height of the SVG canvas
        .style("background","lightgray");
 
    /*
    * grid events
     */
    svgGrid.on("click", mouseClickToGrid);
    svgGrid.on("mousemove", mouseMoveToGrid);

    /*
    * initially, all grids are hidden. 
    * so, ref : topo.html, and see function named 'addGrid()', particularly onChange: "visibility()"
     */
    svgGrid.style("visibility", "hidden");
    svgGrid.style("position", "absolute") 

    /*
    * range(1,2,3)
    * @param {int} 1 coordinate Y where the first horizontal line is drawn
    * @param {int} 2 height/width, maximum drawing distance for horizontal lines - @param 1
    * @param {int} 3 spacing between lines
    */
    var y_axis = d3.range(25, heightGrid, 25);
    var x_axis = d3.range(25, widthGrid, 25);
        
    // Using the x_axis to generate vertical lines
    svgGrid.selectAll("line.vertical")
        .data(x_axis)
        .enter().append("svg:line")
        .attr("x1", function(d){return d;})
        .attr("y1", 0)
        .attr("x2", function(d){return d;})
        .attr("y2", heightGrid)
        .style("stroke", "rgb(6,120,155)")
        .style("stroke-width", 2);       
      
    // Using the y_axis to generate horizontal lines       
    svgGrid.selectAll("line.horizontal")
        .data(y_axis)
        .enter().append("svg:line")
        .attr("x1", 0)
        .attr("y1", function(d){return d;})
        .attr("x2", widthGrid)
        .attr("y2", function(d){return d;})
        .style("stroke", "rgb(6,120,155)")
        .style("stroke-width", 2);

    //if onClick on grid, putting a wall or a floor or a object depending the item selected
    //in fact, this function is used just for walls..
    function mouseClickToGrid() {

        var x = d3.mouse(this)[0];
        var y = d3.mouse(this)[1];

        switch(container.getCurrentItem()){

            case "floor":
                break;

            case "wall":

                if(isAfterDrag)
                    isAfterDrag=false;
                else
                    (firstClick) ?  currentGrid.addCurrentLine(x,y, depthWall) : currentGrid.addWall(x,y, depthWall, heightWall);
                break;

            case "object":
                break;

            case "painting":
                break;

            default: console.log("currentItem not found");
        }
    }

    /**
     * adds a red current line giving an overview before saving.
     * @param {float} x mouse position
     * @param {float} y mouse position
     */
    this.addCurrentLine = function(x,y, depth){

        tempPositions[0]=x;
        tempPositions[1]=y;

        svgGrid.append("line")
            .attr("class", "current")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x)
            .attr("y2", y)
            .attr("stroke-width", depth)
            .style("stroke", "red");
            firstClick=false;
    }

    /**
     * check if a wall is not too short
     * @return {bool}    true if distance is too short
     */
    function checkDistanceIsBad(x1,y1,x2,y2){
        var res=false;
        var distance = getDistance(x1, y1, x2, y2);
        if(distance<WIDTH_MIN_WALL)
            res=true;  
        return res;
    }

    /**
     * create a wall with all events linked
     * in draw():
     *     -mousemove : checkBounds function, used to link others walls easily.
     *     -dblclick : used to remove it
     *     -drag : used to drag it on grid and update positions
     * add it in walls table 
     * @param {float} x mouse position, second click
     * @param {float} y mouse position, second click
     * tempPositions[0],tempPositions[1] used to save first click
     */
    this.addWall = function(x,y, depth, height){

                if(checkDistanceIsBad(tempPositions[0], tempPositions[1], x, y))
                    return;

                var wall = new DThreeSpaces.Wall(tempPositions[0], tempPositions[1], x, y, depth, height);
                wall.draw();
                walls.push(wall);

                currentGrid.cleaning();
                firstClick=true;
                console.log("wall added !");
    }

    /**
     * add a object model with all events linked.
     * in draw():
     *     -dblclick : used to remove it
     *     -drag : used to drag it on grid and update positions
     */
    this.addObject = function(x, y, model){

        var object = new DThreeSpaces.Object(x, y, model);
        object.draw();
        objects.push(object);

        currentGrid.cleaning();
        container.setCurrentObject("");
        firstMouseOver=true;
        console.log("wall added !");
    }


    /**
     * add a object model with all events linked.
     * in draw():
     *     -dblclick : used to remove it
     */
    this.addPainting = function(x, y, angle, model){
  
        var painting = new DThreeSpaces.Painting(x, y, angle, model);
        painting.draw();
        paintings.push(painting);

        currentGrid.cleaning();
        container.setCurrentObject("");
        firstMouseOver=true;
        console.log("painting added !");      
    }

    /**
     * add a door.
     */
    this.addDoor = function(x1, y1, x2, y2, depth){
        var door = new DThreeSpaces.Door(x1, y1, x2, y2, depth);
        door.draw();
        doors.push(door);

        currentGrid.cleaning();
        container.setCurrentObject("");
        firstMouseOver=true;
        doorLocked = false;
        console.log("door added !");      
    }

    /**
     * Not used, detecting whether there is a collision
     */
    this.checkCollides = function(item){

        var res;
        svgGrid
            .selectAll("line.added")
            .each(function(){

                var selected = d3.select(this);
                var x1 = selected.attr("x1");
                var x2 = selected.attr("x2");
                var y1 = selected.attr("y1");
                var y2 = selected.attr("y2");

                var m = (y2 - y1) / (x2 - x1);
                var p = y1 - (m * x1);
                //y =mx+p;

                if(
                    (parseInt(item.attr("y1")) == parseInt(( m * item.attr("x1") + p)))
                    ||
                    (parseInt(item.attr("y2")) == parseInt(( m * item.attr("x2") + p)))
                ){
                    return res = selected
                }
            });
        return res;
    }

    /**
     * clean all drawings of class : current
     * used when keyup escap
     */
    this.cleaning = function(){
        d3.selectAll(".current").remove();
        firstClick=true;
        firstMouseOver=true;
        isAfterDrag = false;
        container.setCurrentObject("");
        onWall=false;
        doorLocked=false;
    }

    function mouseMoveToGrid() {

        var x = d3.mouse(this)[0];
        var y = d3.mouse(this)[1];
        
        switch(container.getCurrentItem()){

            case "wall":

                if(firstClick==true)
                    return;
               
                svgGrid
                    .selectAll("line.current")
                    .attr("x2", x)
                    .attr("y2", y);
                
                break;

            case "object":

                if (container.getCurrentObject()=="")
                    return;

                if(firstMouseOver){
                    svgGrid
                        .append("rect")
                        .style("stroke","red")
                        .attr("stroke-width", 3)
                        .attr("class", "current")
                        .attr("x", x-objectWidth/2)
                        .attr("y", y-objectHeight/2)
                        .attr("width", objectWidth)
                        .attr("height", objectWidth)
                        .on("click", function(){
                            var x = d3.mouse(this)[0];
                            var y = d3.mouse(this)[1];
                            currentGrid.addObject(x, y, container.getCurrentObject());
                        })
                        .on("mousemove", mouseMoveToGrid);

                    firstMouseOver = false;
                }else{
                    svgGrid
                        .selectAll("rect.current")
                        .attr("x", x-objectWidth/2)
                        .attr("y", y-objectHeight/2);
                }

                break;

            case "painting":
                break;

            case "window":
                break;

            case "door":

                if (container.getCurrentObject()=="")
                    return;

                if(doorLocked==true)
                    return;

                if(firstMouseOver){
                    svgGrid
                        .append("line")
                        .style("stroke","red")
                        .attr("stroke-width", doorDepth)
                        .attr("class", "current")
                        .attr("x1", x-(doorWidth/2))
                        .attr("y1", y-10)
                        .attr("x2", x+(doorWidth/2))
                        .attr("y2", y-10)
                        //.on("click", addPainting)
                        .on("mousemove", mouseMoveToGrid);

                        firstClickX=x;
                        firstClickY=y;

                    firstMouseOver = false;
                }else{

                        var select = svgGrid.selectAll("line.current")
                        var x1 = select.attr("x1");
                        var x2 = select.attr("x2");
                        var y1 = select.attr("y1");
                        var y2 = select.attr("y2");

                        x1 -= (firstClickX-x);
                        x2 -= (firstClickX-x);
                        y1 -= (firstClickY-y);
                        y2 -= (firstClickY-y);

                                
                        svgGrid
                            .selectAll("line.current")
                            .attr("x1", x1)
                            .attr("y1", y1)
                            .attr("x2", x2)
                            .attr("y2", y2);

                        firstClickX=x;
                        firstClickY=y;

                        var res = currentGrid.checkCollides(select);
                        if(res!=null){
                            var xx = parseInt(res.attr("x1"));
                            var yy = parseInt(res.attr("y1"));
                            var xxx = parseInt(res.attr("x2"));
                            var yyy = parseInt(res.attr("y2"));
                            var resized = resize(xx, yy, xxx, yyy, doorWidth);
                            svgGrid
                                .selectAll("line.current")
                                .attr("x1", resized[0])
                                .attr("y1", resized[1])
                                .attr("x2", resized[2])
                                .attr("y2", resized[3])
                                .on("click", function(){
                                    currentGrid.addDoor(resized[0], resized[1], resized[2], resized[3], doorDepth);
                                });
                            doorLocked=true;
                        }
                }//SO DIRTY
                break;

            default: console.log("currentItem not found");
        }

    }


    /*accessors*/
    this.getWidth = function(){
        return widthGrid;
    }
    this.getObjects = function(){
        return objects;
    }
    this.getWalls = function(){
        return walls;
    }
    this.getPaintings = function(){
        return paintings;
    }
    this.getDoors = function(){
        return doors;
    }
    this.getHeight = function(){
        return heightGrid;
    }
    this.getDepth = function(){
        return depth;
    }
    this.getCurrentWall = function(){
        return currentWall;
    }
    this.getSVG = function(){
        return svgGrid;
    }


    this.setVisible = function() {
        svgGrid.style("visibility", "visible");
    }
    this.setHidden = function() {
        svgGrid.style("visibility", "hidden");
    }

    this.toJson = function() {

        var json = '{"r":"'+r+'","width":"'+widthGrid+'","height":"'+heightGrid+'","depth":"'+depth+'","texture":"'+texture+'"';

        json += ', "walls": [';
        if(walls.length>0){
            for(var i=0; i<walls.length; i++){
                json += walls[i].toJson().concat(',');
            }
            json = json.slice(0, json.lastIndexOf(','));
        }
        json += ']';

        json += ', "objects": [';
        if(objects.length>0){
            for(var i=0; i<objects.length; i++){
                json += objects[i].toJson().concat(',');
            }
            json = json.slice(0, json.lastIndexOf(','));
        }
        json += ']';

        json += ', "paintings": [';
        if(paintings.length>0){
            for(var i=0; i<paintings.length; i++){
                json += paintings[i].toJson().concat(',');
            }
            json = json.slice(0, json.lastIndexOf(','));
        }
        json += ']';

        return json.concat('}');
    }
    
}



/***
 ** WALL
 ******
 ****
 **/
DThreeSpaces.Wall = function(x1, y1, x2, y2, depth, heigth) {

    var doors = [];
    var windows = [];
    
    var line;
    var texture = 'assets/textures/floor/dark_wood.jpg';

    var x1 = x1;
    var y1 = y1;
        var xy1 = getTruePositions(x1, y1);

    var x2 = x2;
    var y2 = y2;
        var xy2 = getTruePositions(x2, y2);

    var posX = Math.abs((x1 + x2)/2);
    var posY = Math.abs((y1 + y2)/2);
        var posXY = getTruePositions(posX, posY);

    var angle = Math.atan2(xy1[1] - xy2[1], xy1[0] - xy2[0]);

    var depth = depth;
    var heigth = heigth;
    var width = getDistance(x1, y1, x2, y2);

    this.getHeigth = function(){
        return heigth;
    }
    this.getDepth = function(){
        return depth;
    }
    this.getAngle = function(){
        return angle;
    }

    this.toJson = function() {

        var json = '{"width":"'+width+'","heigth":"'+heigth+'","depth":"'+depth+'","posX":"'+posXY[0]+'","posZ":"'+posXY[1]+'","angle":"'+angle+'","texture":"'+texture+'"';
    
        json += ', "doors": [';
        if(doors.length>0){
            for(var i=0; i<doors.length; i++){
                json += doors[i].toJson().concat(',');
            }
            json = json.slice(0, json.lastIndexOf(','));
        }
        json += ']';

        json += ', "windows": [';
        if(windows.length>0){
            for(var i=0; i<windows.length; i++){
                json += windows[i].toJson().concat(',');
            }
            json = json.slice(0, json.lastIndexOf(','));
        }
        json += ']';

        return json.concat('}');
    }

    this.draw = function(){

        var wall = this;
        var walls = currentGrid.getWalls();
        var svg = currentGrid.getSVG();

        line = svg.append("line")
                    .attr("class", "added")
                    .attr("x1", x1)
                    .attr("y1", y1)
                    .attr("x2", x2)
                    .attr("y2", y2)
                    .attr("stroke-width", depth)
                    .style("stroke", "green")
                    .on("mousemove", function(){

                            var xMouse = d3.mouse(this)[0];
                            var yMouse = d3.mouse(this)[1];

                            if(container.getCurrentItem()=="painting"){
                                if(container.getCurrentObject()=="")
                                    return;
                                    if(firstMouseOver){
                                        svg
                                            .append("circle")
                                            .attr("class", "current")
                                            .attr("cx", xMouse).attr("cy", yMouse).attr("r", 5)
                                            .attr("stroke-width", 3).style("stroke", "red")
                                            .on("click", function(){
                                                var select = d3.select(this);
                                                currentGrid.addPainting(select.attr("cx"),select.attr("cy"),wall.getAngle(),container.getCurrentObject());
                                            });
                                        firstMouseOver = false;
                                    }else{
                                        svg
                                            .selectAll("circle.current")
                                            .attr("cx", xMouse)
                                            .attr("cy", yMouse);
                                    }
                            }

                            if(container.getCurrentItem()!="wall")
                                return;

                            var line = d3.select(this);

                            var xRange = 7;
                            var yRange = 7;

                            wall.checkBounds(xMouse, yMouse, xRange, yRange);
                    })
                    .on("dblclick", function() {
                        this.remove();
                        walls.splice(walls.indexOf(wall), 1);
                    })
                    .call(
                        d3.behavior.drag()
                            .on("dragstart", function(d) {
                                d3.select(this)
                                    .style("stroke","blue");
                                if(container.getCurrentItem()!="wall")
                                    return;
                                var selected = d3.select(this);
                                walls.splice(walls.indexOf(selected), 1); 
                                firstClickX = d3.mouse(this)[0];
                                firstClickY = d3.mouse(this)[1];

                            })
                            .on("drag", function(d) {
                                isAfterDrag = true;
                                if(container.getCurrentItem()!="wall")
                                    return;
                                var select = d3.select(this);

                                var x1 = select.attr("x1");
                                var x2 = select.attr("x2");
                                var y1 = select.attr("y1");
                                var y2 = select.attr("y2");

                                var x = d3.mouse(this)[0];
                                var y = d3.mouse(this)[1];

                                x1 -= (firstClickX-x);
                                x2 -= (firstClickX-x);
                                y1 -= (firstClickY-y);
                                y2 -= (firstClickY-y);
                                
                                select
                                    .attr("x1", x1)
                                    .attr("y1", y1)
                                    .attr("x2", x2)
                                    .attr("y2", y2);

                                firstClickX=x;
                                firstClickY=y;
                       
                            })
                            .on("dragend", function(d) {
                                var selected = d3.select(this)
                                    .style("stroke","green"); 
                                if(container.getCurrentItem()!="wall")
                                    return alert("drag denied, you need to select construction mode : wall");
                                walls.push(new DThreeSpaces.Wall(selected.attr("x1"), selected.attr("y1"), selected.attr("x2"), selected.attr("y2"), wall.getDepth(), wall.getHeigth()));
                            })
                    );
   
    }

    /**
     * used to link walls easily.
     */
    this.checkBounds = function(xMouse, yMouse, xRange, yRange){

        var x1 = line.attr("x1");
        var x2 = line.attr("x2");
        var y1 = line.attr("y1");
        var y2 = line.attr("y2");

        var svg = currentGrid.getSVG();
        var currentLine = svg.select("line.current");

        var circle; 

        if(currentLine.empty()){

                                if(     (x2 < (xMouse + xRange) && x2 > (xMouse - xRange))
                                    &&  (y2 < (yMouse + yRange) && y2 > (yMouse - yRange))
                                ){
                                    circle = svg.append("circle")
                                        .attr("cx", x2).attr("cy", y2)
                                        .attr("class", "current")
                                        .attr("r", 10)
                                        .attr("stroke-width", 3)
                                        .style("stroke", "red");
                                    currentGrid.addCurrentLine(x2, y2, depthWall);
                                }

                                if(     (x1 < (xMouse + xRange) && x1 > (xMouse - xRange))
                                    &&  (y1 < (yMouse + yRange) && y1 > (yMouse - yRange))
                                ){
                                    circle = svg.append("circle")
                                        .attr("cx", x1).attr("cy", y1)
                                        .attr("class", "current")
                                        .attr("r", 10)
                                        .attr("stroke-width", 3)
                                        .style("stroke", "red");
                                    currentGrid.addCurrentLine(x1, y1, depthWall);
                                }
        }else{

                                if(     (x2 < (xMouse + xRange) && x2 > (xMouse - xRange))
                                    &&  (y2 < (yMouse + yRange) && y2 > (yMouse - yRange))
                                ){
                                    circle = svg.append("circle")
                                        .attr("cx", x2).attr("cy", y2)
                                        .attr("class", "current")
                                        .attr("r", 10)
                                        .attr("stroke-width", 3)
                                        .style("stroke", "red");
                                    currentGrid.addWall(circle.attr("cx"), circle.attr("cy"), depthWall);
                                 }

                                if(     (x1 < (xMouse + xRange) && x1 > (xMouse - xRange))
                                    &&  (y1 < (yMouse + yRange) && y1 > (yMouse - yRange))
                                ){
                                    circle = svg.append("circle")
                                        .attr("cx", x1).attr("cy", y1)
                                        .attr("class", "current")
                                        .attr("r", 10)
                                        .attr("stroke-width", 3)
                                        .style("stroke", "red");
                                    currentGrid.addWall(circle.attr("cx"), circle.attr("cy"), depthWall);
                                }

        }
    }

    this.resize = function(newDistance){

        var oldDistance = getDistance(x1, y1, x2, y2);

        //var sub = Math.abs(distance - newDistance);

        var m = (y2 - y1) / (x2 - x1);
        var p = y1 - (m * x1);
        //var y = m * x1 + p;

        var midX = Math.abs((x1 + x2)/2);
        var midY = Math.abs((y1 + y2)/2);

        Math.sqrt(Math.pow((x2 - x1),2)+Math.pow((y2 - y1),2)); 

        var test1X = midX;
        var test2Y = midY;

        var distance = 0;
        var i = 0;
        while(distance < newDistance){
            test1X = (test1X + i);
            test1Y = m * test1X + p;
            distance = getDistance(midX, midY, test1X, test2Y);
            i++;
        }

    } 
}

/***
 ** OBJECT
 ******
 ****
 **/
DThreeSpaces.Object = function(x, y, model) {

    var x = x;
    var y = y;
    var angle = angle;
    var model = model;
        var xy = getTruePositions(x, y);

    this.draw = function(){

        var object = this;
        var svg = currentGrid.getSVG();
        var objects = currentGrid.getObjects();

                svg
                    .append("rect")
                    .style("stroke","green")
                    .attr("stroke-width", 3)
                    .attr("class", "added")
                    .attr("x", function(){       
                        var xMouse = d3.mouse(this)[0]-objectWidth/2;
                        return xMouse;
                    })
                    .attr("y", function(){       
                        var xMouse = d3.mouse(this)[1]-objectHeight/2;
                        return xMouse;
                    })
                    .attr("width", objectWidth)
                    .attr("height", objectHeight)
                    .on("dblclick", function() {
                        this.remove();
                        objects.splice(objects.indexOf(object), 1);
                    })
                    .call(
                        d3.behavior.drag()
                            .on("dragstart", function(d) {
                                var selected = d3.select(this)
                                    .style("stroke","blue");
                                if(container.getCurrentItem()!="object")
                                    return;
                                objects.splice(objects.indexOf(selected), 1); 
                            })
                            .on("drag", function(d) {
                                isAfterDrag = true;
                                if(container.getCurrentItem()!="object")
                                    return;                                
                                var selected = d3.select(this)
                                    .attr("x", d3.mouse(this)[0]-objectWidth/2)
                                    .attr("y", d3.mouse(this)[1]-objectHeight/2);

                             })
                            .on("dragend", function(d) {
                                var selected = d3.select(this)
                                    .style("stroke","green"); 
                                if(container.getCurrentItem()!="object")
                                    return alert("drag denied, you need to select construction mode : object");               
                                objects.push(new DThreeSpaces.Object(selected.attr("x"), selected.attr("y"), model));     
                            })
                    );
    }

    this.toJson = function() {
        return '{"posX":"'+xy[0]+'","posZ":"'+xy[1]+'","model":"'+model+'"}';
    }
}


/***
 ** PAINTING
 ******
 ****
 **/
DThreeSpaces.Painting = function(x, y, angle, model) {

    var x = x;
    var y = y;
    var angle = angle;
    var model = model;
        var xy = getTruePositions(x, y);

    var posY = 100; // i've no time

    this.draw = function(){

        var painting = this;
        var svg = currentGrid.getSVG();
        var paintings = currentGrid.getPaintings();

        svg.append("circle")
            .attr("class", "added")
            .attr("cx", x).attr("cy", y).attr("r", 5)
            .attr("stroke-width", 3).style("stroke", "lightgreen")
            .on("dblclick", function() {
                this.remove();
                paintings.splice(paintings.indexOf(painting), 1);
            })
            .call(
                        d3.behavior.drag()
                            .on("dragstart", function(d) {
                                var selected = d3.select(this)
                                    .style("stroke","blue");
                            })
                            .on("dragend", function(d) {
                                var selected = d3.select(this)
                                    .style("stroke","lightgreen"); 
                                if(container.getCurrentItem()!="painting")
                                    return alert("drag denied, you need to select construction mode : painting");     
                            })
            );
    }


    this.toJson = function() {
        return '{"posX":"'+xy[0]+'","posY":"'+posY+'","posZ":"'+xy[1]+'","angle":"'+angle+'","model":"'+model+'"}';
    }
}

/***
 ** DOOR
 ******
 ****
 **/
DThreeSpaces.Door = function(x1, y1, x2, y2, depth) {

    var x1 = x1;
    var y1 = y1;
        var xy1 = getTruePositions(x1, y1);
    var x2 = x2;
    var y2 = y2;
        var xy2 = getTruePositions(x2, y2);

    var angle = Math.atan2(xy1[1] - xy2[1], xy1[0] - xy2[0]);

    var depth = depth;
        

    this.draw = function(){

        var door = this;
        var doors = currentGrid.getDoors();
        var svg = currentGrid.getSVG();

        line = svg.append("line")
                    .attr("class", "added")
                    .attr("x1", x1)
                    .attr("y1", y1)
                    .attr("x2", x2)
                    .attr("y2", y2)
                    .attr("stroke-width", doorDepth)
                    .style("stroke", "yellow")
                    .on("dblclick", function() {
                        this.remove();
                        doors.splice(doors.indexOf(door), 1);
                    })
                    .call(
                                    d3.behavior.drag()
                                        .on("dragstart", function(d) {
                                            d3.select(this)
                                                .attr("class", "added")
                                                .style("stroke","blue");
                                            if(container.getCurrentItem()!="door")
                                                return;
                                            var selected = d3.select(this);
                                            doors.splice(doors.indexOf(selected), 1); 
                                            firstClickX = d3.mouse(this)[0];
                                            firstClickY = d3.mouse(this)[1];

                                        })
                                        .on("drag", function(d) {
                                            isAfterDrag = true;
                                            if(container.getCurrentItem()!="door")
                                                return;
                                            var select = d3.select(this);

                                            var x1 = select.attr("x1");
                                            var x2 = select.attr("x2");
                                            var y1 = select.attr("y1");
                                            var y2 = select.attr("y2");

                                            var x = d3.mouse(this)[0];
                                            var y = d3.mouse(this)[1];

                                            x1 -= (firstClickX-x);
                                            x2 -= (firstClickX-x);
                                            y1 -= (firstClickY-y);
                                            y2 -= (firstClickY-y);
                                            
                                            select
                                                .attr("x1", x1)
                                                .attr("y1", y1)
                                                .attr("x2", x2)
                                                .attr("y2", y2);

                                            firstClickX=x;
                                            firstClickY=y;

                                        })
                                        .on("dragend", function(d) {
                                            var selected = d3.select(this)
                                                .style("stroke","yellow"); 
                                            if(container.getCurrentItem()!="door")
                                                return alert("drag denied, you need to select construction mode : door");
                                            doors.push(new DThreeSpaces.Door(selected.attr("x1"), selected.attr("y1"), selected.attr("x2"),selected.attr("y2"), doorDepth));
                                        })
                            );
    }

    this.toJson = function() {
        return '{"x1":"'+xy1[0]+'","y1":"'+xy1[1]+'","x2":"'+xy2[0]+'","y2":"'+xy2[1]+'","angle":"'+angle+'","depth":"'+depth+'"}';
    }
}

/***
 ** WINDOW
 ******
 ****
 **/
DThreeSpaces.Window = function(x, y, angle) {
    var x = x;
    var y = y;
    var angle = angle;
        var xy = getTruePositions(x, y);

    var height = 50;// i've no time :)

    this.draw = function(){

    }

    this.toJson = function() {
        return '{"posX":"'+xy[0]+'","posZ":"'+xy[1]+'","height":"'+height+'"}';
    }
}



/***
 ** TOOLS
 ******/
function getTruePositions(x, y){
        var x = x;
        var y = y;
        var truePositions = [];
        truePositions.push(x - currentGrid.getWidth()/2);
        truePositions.push(y - currentGrid.getHeight()/2);
        return truePositions;

}
function getDistance(x1, y1, x2, y2){
     var distance = Math.sqrt(Math.pow((x2 - x1),2)+Math.pow((y2 - y1),2)); 
     return distance;
}

function resize(x1, y1, x2, y2, newDistance){

        var res = [];
        //var oldDistance = getDistance(x1, y1, x2, y2);
        //var sub = Math.abs(distance - newDistance);

        var m = (y2 - y1) / (x2 - x1);
        var p = y1 - (m * x1);
        //var y = m * x1 + p;
      
        var midX = (x1 + x2)/2;
        var midY = (y1 + y2)/2;
        console.log("midX="+midX);
        console.log("midY="+midY);

        var testX = midX;
        var testY = midY;

        var distance = 0;
        var i = 0;
        while(distance < newDistance){
            console.log("distance="+distance);
            testX = (testX + i);
            testY = m * testX + p;
            distance = getDistance(midX, midY, testX, testY);
            console.log("distance="+distance);
            i++;
        }
        res.push(midX);
        res.push(midY);
        res.push(testX);
        res.push(testY);
        
        return res;
} 