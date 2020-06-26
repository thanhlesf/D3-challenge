// @TODO: YOUR CODE HERE!
// Setup width and height parameters in the canvas
var svgWidth = 800;
var svgHeight = 450;

// Setup svg margins (inside the canvas)
var margin = {
  top: 30,
  right: 40,
  bottom: 80,
  left: 90
};

// Setup the width and height of the chart group based svg margins and parameters within the canvas
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the canvas to append the SVG group that hold the states data with canvas width and height.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create the chartGroup that will contain the data
// Use transform attribute to fit it within the canvas
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
var file = "assets/data/data.csv"

// Function is called and passes csv data
d3.csv(file).then(successHandle, errorHandle);

// Use error handling function to append data and SVG objectsnIf error exist 
function errorHandle(error) {
  throw err;
}

// Function takes in argument statesData
function successHandle(statesData) {

  // Loop through the data and pass argument data
  statesData.map(function (data) {
    data.smokes = +data.smokes;
    data.age = +data.age;
  });

  //  Create scale functions with Linear Scale 
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.smokes)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(statesData, d => d.age)])
    .range([height, 0]);

  // Create axis functions by calling the scale functions
  var bottomAxis = d3.axisBottom(xLinearScale)

    // Adjust the number of ticks for the bottom axis  
    .ticks(7);

  var leftAxis = d3.axisLeft(yLinearScale);

  // Append the axes to the chart group at Bottom axis moves using height 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Setup append the left axis for drawing the circle
  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", "14")
    .attr("fill", "#001aff")
    .attr("opacity", ".8")

  // Append text to circles 
  var textsGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.smokes))
    .attr("y", d => yLinearScale(d.age))
    .style("font-size", "bold")
    .style("text-anchor", "middle")
    .style('fill', 'white')
       .text(d => (d.abbr));

  // Setup the initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Smoker: ${d.smokes}%<br>Age: ${d.age}`);
    });

  // Create tooltip in the chart
    circlesGroup.call(toolTip);
     
  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })

    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-weight", "bold")
    .text("Age (Median)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .attr("font-weight", "bold")
    .text("Smokers %");
}