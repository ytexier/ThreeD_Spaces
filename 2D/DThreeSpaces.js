var DThreeSpaces = { rev: '0.1' }; 

DThreeSpaces.Grid = function() {

	var width = 800;
	var height = 800;

    var firstClick = true;
    var tempPositions = [];
      
	/*
    * Set with and heigh of the SVG canvas
    */
    var svgGrid = d3.select("#grid")
        .append("svg:svg")
        .attr("width", width) //Set width of the SVG canvas
        .attr("height", height); //Set height of the SVG canvas

    svgGrid.on("click", mouseclick);

    /*
    * range(1,2,3)
    * @param {int} 1 coordinate Y where the first horizontal line is drawn
    * @param {int} 2 height/width, maximum drawing distance for horizontal lines - @param 1
    * @param {int} 3 spacing between lines
    */
    var y_axis = d3.range(25, height, 25);
    var x_axis = d3.range(25, width, 25);
        
    // Using the x_axis to generate vertical lines
    svgGrid.selectAll("line.vertical")
    .data(x_axis)
    .enter().append("svg:line")
    .attr("x1", function(d){return d;})
    .attr("y1", 25)
    .attr("x2", function(d){return d;})
    .attr("y2", height-25)
    .style("stroke", "rgb(6,120,155)")
    .style("stroke-width", 2);       
      
    // Using the y_axis to generate horizontal lines       
    svgGrid.selectAll("line.horizontal")
    .data(y_axis)
    .enter().append("svg:line")
    .attr("x1", 25)
    .attr("y1", function(d){return d;})
    .attr("x2", width-25)
    .attr("y2", function(d){return d;})
    .style("stroke", "rgb(6,120,155)")
    .style("stroke-width", 2);

    function mouseclick() {

            //mouse click positions
            var x = d3.mouse(this)[0];
            var y = d3.mouse(this)[1];
            if(firstClick){

                tempPositions[0]=x;
                tempPositions[1]=y;
                firstClick=false;
            }else{

                var line = svgGrid.append("line")
                .attr("x1", tempPositions[0])
                .attr("y1", tempPositions[1])
                .attr("x2", x)
                .attr("y2", y)
                .attr("stroke-width", 2)
                .attr("stroke", "black");
                firstClick=true;
            }
    }

}

