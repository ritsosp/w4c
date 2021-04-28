var margin = { top: 10, right: 10, bottom: 20, left: 20 };

var barcolors = d3.scaleOrdinal()
    .domain(["A","B","C", "D"])
    .range(["#fef0c1", "#fdb408", "#b07e05", "#6b4e02"]);

var barChartHeight = +d3.select("#BarChart").style('height').slice(0, -2);
var barContainerWidth = +d3.select("#BarChart").style('width').slice(0, -2);

console.log(barChartHeight + ", " + barContainerWidth);

barChartHeight = barChartHeight - margin.top - margin.bottom;
barContainerWidth = barContainerWidth - margin.left - margin.right;

console.log(barChartHeight + ", " + barContainerWidth);

var barChart = d3.select("#BarChart")
                  .append("svg")
                  .attr("width",barContainerWidth + margin.left + margin.right)
                  .attr("height",barChartHeight + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
	.rangeRound([0, barContainerWidth])
	.padding(0.1);
barChart.append("g")
.attr("class", "axisbottom")
.attr("transform", "translate(0," + barChartHeight + ")")
.call(d3.axisBottom(x));

var y = d3.scaleLinear()
  .domain([0, 12])
	.range([barChartHeight, 0]);
barChart.append("g")
.attr("class", "axisleft")
.call(d3.axisLeft(y));;

	// barChart.append("g")
	// .attr("transform", "translate(0," + barChartHeight + ")")
	// .call(d3.axisBottom(x));
  //
	// barChart.append("g")
	// .call(d3.axisLeft(y));

	var gridlinesy = d3.axisLeft(y)
										.tickFormat("")
										.tickSize(-barContainerWidth)
										.scale(y);
	barChart.append("g")
	 .attr("class", "grid")
	 .call(gridlinesy);


	 var tooltip = d3.select("body")
	   .append("div")
	   .attr("data-html", "true")
	   .attr('class', 'tooltip');

  var unit;

  var buttonAreaHeight = +d3.select("#Buttons").style('height').slice(0, -2);
  var buttonAreaWidth = +d3.select("#Buttons").style('width').slice(0, -2);


  var buttonArea = d3.select("#Buttons")
                    .append("svg")
                    .attr("width",buttonAreaWidth)
                    .attr("height",buttonAreaHeight);

  // var buttondata = [{label: "Click me",     x: 1, y: 1 },
  //                   {label: "Click me",     x: 15, y: 15 },
  //                   {label: "Click me",     x: 1, y: 15 },
  //                   {label: "Click me",     x: 15, y: 1 }];

  var buttondata = [{nochange: 1, fiveincrease: 1.05, tenincrease: 1.10, twentyincrease: 1.2}];

function SoilData(selectUnit){

   unit = selectUnit;

    d3.csv("data/Soil_type.csv").then(function (data) {
    	x.domain(data.map(function (d) {
    			return d.Soil_type;
    		}));
    	y.domain([0, d3.max(data, function (d) {
    				return Number(d.Loss_rate_max);
    			})]);

			barChart.selectAll(".bar").remove();

    	var bars = barChart.selectAll(".bar")
    	.data(data)
    	.enter()
			.append("rect")
    	.attr("class", "bar")
    	.attr("x", function (d) {
    		return x(d.Soil_type);
    	})
    	.attr("y", function (d) {
    		return y(Number(d.Loss_rate_max));
    	})
			.style("fill", function(d) { return barcolors(d.Soil_type) })
    	.attr("width", x.bandwidth())
    	.attr("height", function (d) {
    		return barChartHeight - y(Number(d.Loss_rate_max - d.Loss_rate_min));
    	})
			// .on("click", function (d) {location.replace(d.Soil_type+".html");})
			// .on("mouseover", function() { .attr("fill", "red");})
			.style("opacity", 1)
			.on("mousemove", function(d){
            tooltip
							.style("visibility", "visible")
							.style("opacity", 1.0)
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .text("Double click for soil type information.");
        })
    		.on("mouseout", function(d){ tooltip.style("visibility", "hidden").transition().duration(200);})
				.on('dblclick', function(d) {
				    console.log('open tab')
            console.log(d.Soil_type)
				    window.open(
				      d.Soil_type+".html",
				      '_blank' // <- This is what makes it open in a new window.
    		);
  	   })
    .on("click", function(d){ selectedSoil(d.Soil_type);volumeData(unit);})

				// .on("mouseover", function(d) { return tip.style("visibility", "visible").text("Rainfall Duration:  " + d.value + "min").style("opacity", 1.0)})
				// .on("mousemove", function() { return tip.style("left", (d3.event.pageX - 28) + "px").style("top", (d3.event.pageY + 10) + "px");})
				// .on("mouseout", function() { return tip.style("visibility", "hidden").transition().duration(200).style("opacity", 0)});

			bars.transition()
    	.duration(1000)


			barChart.selectAll(".text")
			  .data(data)
			  .enter()
			  .append("text")
			  .attr("class","label")
			  .attr("x", (function(d) { return x(d.Soil_type) + 10; }  ))
			  .attr("y", function(d) { return y(d.Loss_rate_max - (d.Loss_rate_max - d.Loss_rate_min)/2) - 7; })
			  .attr("dy", "0.75em")
			  .text(function(d) { return d.Soil_type; })
				.style("font-size", "15px")
				.style("fill", "#000000");
    });



    // var nochange = 1;
    // var fiveincrease = 1.05;
    // var tenincrease = 1.10;
    // var twentyincrease = 1.2;

    // var button = d3.button()
    // .on('press', function(d, i) { console.log("Pressed", d, i, this.parentNode)});

    buttonArea.selectAll(".button").remove();
    // Add buttons
    var button1 = buttonArea.append("g")
    .selectAll("g")
        .data(buttondata)
      .enter()
        .append('rect')
        .attr('class', 'button')
        .attr("x", 5)
      	.attr("y", 10)
      	.attr("width", 75)
      	.attr("height", 30)
        .on('click', function(d) {
          console.log(d.nochange);
          selectedchange(d.nochange); volumeData(unit);
        })
        .on("mousemove", function() {d3.select(this).attr("fill", "#d1d1d1");})
      	.on("mouseout", function() {d3.select(this).attr("fill", "white");});

        buttonArea.append("text")
  			  .attr("class","label")
  			  .attr("x", 15)
  			  .attr("y", 20)
  			  .attr("dy", "0.75em")
  			  .text("No Change");

        buttonArea.append("g")
        .selectAll("g")
            .data(buttondata)
          .enter()
            .append('rect')
        .attr('class', 'button')
        .attr("x", 90)
      	.attr("y", 10)
      	.attr("width", 75)
      	.attr("height", 30)
        .on('click', function(d) {
          console.log(d.fiveincrease);
          selectedchange(d.fiveincrease); volumeData(unit);
        })
        .on("mousemove", function() {d3.select(this).attr("fill", "#d1d1d1");})
      	.on("mouseout", function() {d3.select(this).attr("fill", "white");});

        buttonArea.append("text")
  			  .attr("class","label")
  			  .attr("x", 100)
  			  .attr("y", 20)
  			  .attr("dy", "0.75em")
  			  .text("5% increase");


        buttonArea.append("g")
        .selectAll("g")
            .data(buttondata)
          .enter()
            .append('rect')
        .attr('class', 'button')
        .attr("x", 5)
      	.attr("y", 50)
      	.attr("width", 75)
      	.attr("height", 30)
        .on('click', function(d) {
          console.log(d.tenincrease);
          selectedchange(d.tenincrease); volumeData(unit);
        })
        .on("mousemove", function() {d3.select(this).attr("fill", "#d1d1d1");})
      	.on("mouseout", function() {d3.select(this).attr("fill", "white");});

        buttonArea.append("text")
  			  .attr("class","label")
  			  .attr("x", 15)
  			  .attr("y", 60)
  			  .attr("dy", "0.75em")
  			  .text("10% increase");


        buttonArea.append("g")
        .selectAll("g")
            .data(buttondata)
          .enter()
            .append('rect')
        .attr('class', 'button')
        .attr("x", 90)
      	.attr("y", 50)
      	.attr("width", 75)
      	.attr("height", 30)
        .on('click', function(d) {
          console.log(d.twentyincrease);
          selectedchange(d.twentyincrease); volumeData(unit);
        })
        .on("mousemove", function() {d3.select(this).attr("fill", "#d1d1d1");})
      	.on("mouseout", function() {d3.select(this).attr("fill", "white");});

        buttonArea.append("text")
  			  .attr("class","label")
  			  .attr("x", 100)
  			  .attr("y", 60)
  			  .attr("dy", "0.75em")
  			  .text("20% increase");


        buttonArea.selectAll("rect").attr('fill', 'white')
    .attr('stroke', 'black');

        // var rect = d3.select('svg g rect');
        //
        // rect.on('click', function() {
        //   console.log('i was clicked');
        // });

}



// var margin = {top: 20, right: 20, bottom: 30, left: 40};
//
// var barChartHeight=280;
//
// var barContainerWidth = +d3.select("#BarChart").style('width').slice(0, -2)
// var barChart = d3.select("#BarChart").append("svg").attr("width",barContainerWidth).attr("height",barChartHeight);


// var x = d3.scaleBand()
//           .range([0, barContainerWidth])
//           .padding(0.1);
// var y = d3.scaleLinear()
//           .range([barChartHeight, 0]);
//
// barChart.append("g")
//     .attr("width", barContainerWidth + margin.left + margin.right)
//     .attr("height", barChartHeight + margin.top + margin.bottom)
//     //.append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// function SoilData(selectUnit){
//   // Parse the Data
//   d3.csv("data/Soil_type.csv", function(data) {
//
//   // X axis
//
//
//             data.forEach(function(d) {
//               d.Loss_rate_max = +d.Loss_rate_max;
//             });
//
//             // Scale the range of the data in the domains
//             x.domain(data.map(function(d) { return d.Soil_type; }));
//             y.domain([0, d3.max(data, function(d) { return d.Loss_rate_max; })]);
//
//
//             console.log("soil");
//             // append the rectangles for the bar chart
//             svg.selectAll("mybar")
//               .data(data)
//               .enter()
//               .append("rect")
//                 .attr("x", function(d) { return x(d.Soil_type); })
//                 .attr("y", function(d) { return y(d.Loss_rate_max); })
//                 .attr("width", x.bandwidth())
//                 .attr("height", function(d) { return barChartHeight - y(d.Loss_rate_max); })
//                 .attr("fill", "#69b3a2")
//
//             // add the x Axis
//             barChart.append("g")
//                 .attr("transform", "translate(0," + barChartHeight + ")")
//                 .call(d3.axisBottom(x));
//
//             // add the y Axis
//             barChart.append("g")
//                 .call(d3.axisLeft(y));
//
//           });
// }



//
// var SoilHeight=280;
// var SoilContainerWidth = +d3.select("#barChart").style('width').slice(0, -2)
// var SoilChart = d3.select("#barChart").append("svg").attr("width",SoilContainerWidth).attr("height",SoilHeight);
//
//
// function SoilData(selectUnit) {
//
//   d3.csv("data/Soil_type.csv", function(data) {
//
//   // X axis
//   var x = d3.scaleBand()
//     .range([ 0, SoilContainerWidth ])
//     .domain(data.map(function(d) { return d.Soil_type; }))
//     .padding(0.2);
//   SoilChart.append("g")
//     .attr("transform", "translate(0," + SoilHeight + ")")
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//       .attr("transform", "translate(-10,0)rotate(-45)")
//       .style("text-anchor", "end");
//
//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 13000])
//     .range([ SoilHeight, 0]);
//   SoilChart.append("g")
//     .call(d3.axisLeft(y));
//
//   // Bars
//   SoilChart.selectAll("mybar")
//     .data(data)
//     .enter()
//     .append("rect")
//       .attr("x", function(d) { return x(d.Soil_type); })
//       .attr("y", function(d) { return y(d.Loss_rate_max); })
//       .attr("width", x.bandwidth())
//       .attr("height", function(d) { return SoilHeight - y(d.Loss_rate_max); })
//       .attr("fill", "#69b3a2")
//
//   })
// }
