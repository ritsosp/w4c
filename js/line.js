// Define margins
var margin = { top: 20, right: 20, bottom: 50, left: 50 };

var lineHeight = +d3.select("#lineChart").style('height').slice(0, -2);
var lineContainerWidth = +d3.select("#lineChart").style('width').slice(0, -2);

lineHeight = lineHeight - margin.top - margin.bottom;
lineContainerWidth = lineContainerWidth - margin.left - margin.right;

var lineGraph = d3.select("#lineChart")
.append("svg")
.attr("width", lineContainerWidth + margin.left + margin.right)
.attr("height", lineHeight + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");




// Define date parser
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

// Define scales
var xScale = d3.scaleLinear()
  .domain([0,1500])
  .range([ 0, lineContainerWidth ]);

var yScale = d3.scaleLinear()
  .domain( [0,180])
  .range([ lineHeight, 0 ]);

var linecolor = d3.scaleLinear()
  .domain([2,5,10,25,50,100,250])
  .range([ "#99ccff", "#66b3ff", "#3399ff", "#0080ff", "#0066cc", "#004d99", "#003366"])

// Define axes
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

lineGraph
  .append("g")
  .attr("class", "xaxis")
  .attr("transform", "translate(0," + lineHeight + ")")
  .call(xAxis)
  .append("text")
  .attr("class", "label")
  .attr("y", 40)
  .attr("x", lineContainerWidth/2)
  .text("Rainfall Duration");

lineGraph
  .append("g")
  .attr("class", "yaxis")
  .call(yAxis)
  .append("text")
  .attr("class", "label")
  .attr("y", -40)
  .attr("x", -lineHeight/2)
  .attr("transform", "rotate(270)")
  .text("Rainfall Height");

var tip = d3.select("body")
  .append("div")
  .attr("data-html", "true")
  .attr('class', 'tooltip');

var unit;

function lineData(selectUnit) {

        unit = selectUnit;
        // Read in data
        d3.csv("data/Rain_data.csv").then(function(data) {

          var allGroup = ["2-year","5-year","10-year","25-year","50-year","100-year","250-year"];

          var dataReady = allGroup.map( function(grpName) {
            return {
              name: grpName,
              values: data.map(function(d) {
                return {duration: d.duration, value: +d[grpName]};
              })
            };
          });

          var line = d3.line()
              .x(function(d, i) { return xScale(+d.duration); }) // set the x values for the line generator
              .y(function(d) { return yScale(+d.value); }) // set the y values for the line generator
              .curve(d3.curveMonotoneX);

          var products = lineGraph
            .selectAll(".name")
            .data(dataReady)
            .enter()
            .append("g")
            .attr("class", "name");

          products
            .append("path")
            .attr("class", "line")
            .attr("d", function(d) {
              return line(d.values);
            })
            .style("stroke", function(d) {
              console.log(d.name.substring(0, d.name.indexOf('-')));
              return linecolor(d.name.substring(0, d.name.indexOf('-')));
            });

            products
              .append('g')
              .style("fill", function(d){ return linecolor(d.name.substring(0, d.name.indexOf('-')))})
            // Second we need to enter in the 'values' part of this group
            .selectAll("myPoints")
            .data(function(d){ console.log(d); return d.values; })
            .enter()
            .append("circle")
              .attr("cx", function(d) { return xScale(d.duration) } )
              .attr("cy", function(d) { return yScale(d.value) } )
              .attr("r", 4)
              .attr("stroke", "white")
              .on("mouseover", function(d) { return tip.style("visibility", "visible").html("Rainfall Duration:  " + d.duration + "min" + "<br/>Rainfall Height:  " + d.value + "min").style("opacity", 1.0)})
              .on("mousemove", function() { return tip.style("left", (d3.event.pageX - 28) + "px").style("top", (d3.event.pageY + 10) + "px");})
              .on("click", function(d) { rainLevel(d.value); volumeData(unit);})
              .on("mouseout", function() { return tip.style("visibility", "hidden").transition().duration(200).style("opacity", 0)});


          //products.on("click", function(d) { precipData(d.name)});

          // console.log(JSON.stringify(d3.values(concentrations), null, 2)) // to view the structure
          //console.log(d3.values(dataReady)); // to view the structure
          //console.log(dataReady);
          // console.log(concentrations.map(function()))

          //precipData(e.target.feature.properties.UNIT);
        });


}

// // Define responsive behavior
// function resize() {
//   var width =
//       parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
//     height =
//       parseInt(d3.select("#chart").style("height")) -
//       margin.top -
//       margin.bottom;

//   // Update the range of the scale with new width/height
//   xScale.range([0, width]);
//   yScale.range([height, 0]);

//   // Update the axis and text with the new scale
//   svg
//     .select(".x.axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

//   svg.select(".y.axis").call(yAxis);

//   // Force D3 to recalculate and update the line
//   svg.selectAll(".line").attr("d", function(d) {
//     return line(d.datapoints);
//   });

//   // Update the tick marks
//   xAxis.ticks(Math.max(width / 75, 2));
//   yAxis.ticks(Math.max(height / 50, 2));
// }

// // Call the resize function whenever a resize event occurs
// d3.select(window).on("resize", resize);

// // Call the resize function
// resize();
