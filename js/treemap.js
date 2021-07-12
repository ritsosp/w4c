function getTranslation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);

  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix.
  var matrix = g.transform.baseVal.consolidate().matrix;

  // As per definition values e and f are the ones for the translation.
  return [matrix.e, matrix.f];
}

// create a tooltip
var Tooltip = d3
  .select("#treemap")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tm-tooltip")
  .style("background-color", "white")
  .style("position", "absolute")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("padding", "4px");

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function (d) {
  // console.log(d.data.key);
  Tooltip.style("opacity", 1).style("color", "black");
  d3.select(this).style("opacity", "0.75");
};

var mousemove = function (d) {
  // console.log(d.data.key);

  let t = getTranslation(this.getAttribute("transform"));
  Tooltip.html(`Soil type: ${d.data.key}<br>Value: ${d.data.value}`)
    .style("left", d3.mouse(this)[0] + t[0] + 5 + "px")
    .style("top", d3.mouse(this)[1] + t[1] + 5 + "px");
};

var mouseleave = function (d) {
  // console.log(d.data.key);

  Tooltip.style("opacity", 0);
  d3.select(this).style("stroke", "none").style("opacity", 0.8);
};

var treeMapHeight = 400;

var treeContainerWidth = +d3.select("#treemap").style("width").slice(0, -2);
var treeMap = d3
  .select("#treemap")
  .append("svg")
  .attr("width", treeContainerWidth)
  .attr("height", treeMapHeight)
  .append("g")
  .attr("transform", "translate(" + 0 + "," + 0 + ")");

var data = [];
var newarray = [];
var filteredData;

function selectData(selectUnit) {
  var color = d3
    .scaleLinear()
    .domain([1, 50, 90, 100])
    .range(["#545454", "#898F8B", "#29B200", "#0066CC"]);

  d3.csv("data/EUP_CURRENT_LAND_USE.csv", function (d) {
    data.push({
      unit: d.UNIT,
      landUse: d.LAND_USE,
      currentLandUse: d.CURRENT_LAND_USE_CLASS,
      area: +d.AREA,
    });
  }).then(function (d) {
    filteredData = data.filter(function (d) {
      if (d.unit == selectUnit) {
        return d;
      }
    });
    data = filteredData;

    var treemapLayout = d3
      .treemap()
      .size([treeContainerWidth, treeMapHeight])
      .paddingOuter(0);

    var nest = d3
      .nest()
      .key(function (d) {
        return d.currentLandUse;
      })
      .rollup(function (d) {
        return d3.sum(d, function (d) {
          return +d.area;
        });
      });

    var rootNode = d3
      .hierarchy({ values: nest.entries(data) }, function (d) {
        return d.values;
      })
      .sum(function (d) {
        return d.value;
      });

    treemapLayout(rootNode);

    //console.log(rootNode.leaves());

    treeMap.selectAll("g > *").remove();

    var nodes = treeMap
      .selectAll("g")
      .data(rootNode.leaves())
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + [d.x0, d.y0] + ")";
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    nodes
      .append("rect")
      .attr("width", function (d) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d) {
        return d.y1 - d.y0;
      })
      .style("fill", function (d) {
        return color(col(d.data.key));
      });

    nodes
      .append("text")
      .attr("dx", 4)
      .attr("dy", 14)
      .text(function (d) {
        return d.data.key;
      });
  });
}

function col(d) {
  if (d == "Building") {
    LandUseColor = 1;
  } else if (d == "Street") {
    LandUseColor = 20;
  } else if (d == "Facility") {
    LandUseColor = 30;
  } else if (d == "Path") {
    LandUseColor = 40;
  } else if (d == "Courtyard") {
    LandUseColor = 50;
  } else if (d == "Orchard") {
    LandUseColor = 60;
  } else if (d == "Schrubs") {
    LandUseColor = 70;
  } else if (d == "Grass") {
    LandUseColor = 80;
  } else if (d == "Field") {
    LandUseColor = 89;
  } else if (d == "Water") {
    LandUseColor = 100;
  } else {
    LandUseColor = 0;
  }

  return LandUseColor;
}

// var data = [];
//
// function selectData(selectUnit) {
//
//   // d3.csv("data/EUP_CURRENT_LAND_USE.csv").then(function(data) {
//   //   console.log("columns are: " + data.columns)
//   // })
//   var newarray = [];
//      d3.csv("data/EUP_CURRENT_LAND_USE.csv", function(d) {
//        data.push({
//          unit: d.UNIT,
//          landUse: d.LAND_USE,
//          currentLandUse: d.CURRENT_LAND_USE_CLASS,
//          area: +d.AREA
//        });
//      }).then(function(d) {
//        newarray = d3.nest()
//                       .key(function(k)  { return k.unit; })
//                       .entries(data);
//       console.log(newarray);
//       var filteredData = newarray.filter(function(d)
//         {
//           if( d.key == selectUnit)
//                 {
//                     return d;
//                 }
//
//             })
//
//             data = filteredData;
//
//             var treeMapHeight=400;
//
//             var treeContainerWidth = +d3.select("#treemap").style('width').slice(0, -2)
//
//
//             // var rootNode = d3.hierarchy(data);
//             // console.log(rootNode);
//             //
//             // rootNode.sum(function(d) {
//             //   console.log(d.area);
//             //   return d.value;
//             // });
//
//             var rootNode = d3.hierarchy(data, function(d) { return d.values; })
//                 .sum(function(d) { return d.area; });
//                 console.log(rootNode);
//
//             var treeMap = d3.select("#treemap").append("svg").attr("width",treeContainerWidth).attr("height",treeMapHeight);
//
//             var treemapLayout = d3.treemap()
//                 .size([treeContainerWidth, treeMapHeight])
//                 .paddingOuter(0)
//                 (rootNode);
//
//             //rootNode = rootNode.data;
//
//             //treemapLayout(rootNode);
//
//             //var nodes = treeMap
//             treeMap.selectAll('svg')
//             .selectAll('rect')
//             .data(rootNode.leaves())
//             .enter()
//             .append('rect')
//             .attr('x', function(d) { return d.x0; })
//             .attr('y', function(d) { return d.y0; })
//             .attr('width', function(d) { return d.x1 - d.x0; })
//             .attr('height', function(d) { return d.y1 - d.y0; });
//             // var nodes = treeMap.selectAll('svg')
//             //   .data(rootNode.leaves())
//             //   .enter()
//             //   .append('g')
//             //   .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'});
//             //
//             // nodes
//             //   .append('rect')
//             //   .attr('width', function(d) { return d.x1 - d.x0; })
//             //   .attr('height', function(d) { return d.y1 - d.y0; });
//             //
//             // nodes
//             //   .append('text')
//             //   .attr('dx', 4)
//             //   .attr('dy', 14)
//             //   .text(function(d) {
//             //     return d.data.currentLandUse;
//             //   });
//             // var nodes = treeMap
//             // .selectAll("rect")
//             // .data(rootNode.leaves().values)
//             // .enter()
//             // .append("rect")
//             //   .attr('x', function (d) { return d.x0; })
//             //   .attr('y', function (d) { return d.y0; })
//             //   .attr('width', function (d) { return d.x1 - d.x0; })
//             //   .attr('height', function (d) { return d.y1 - d.y0; })
//             //   .style("stroke", "black");
//               //.style("fill", function(d){return color (col(d.data.key))})
//               // .on("mouseover", function(d) { return tooltip.style("visibility", "visible").text(d.data.key + " " + d.value );})
//               // .on("mousemove", function() { return tooltip.style("top", (event.pageY - 30) + "px").style("left", event.pageX + "px");})
//               // .on("mouseout", function() { return tooltip.style("visibility", "hidden");});
//
//     });
// }
//
//
//   // d3.csv("data/EUP_CURRENT_LAND_USE.csv", function(dataset) {
//   //   var filteredData = dataset.filter(function(d)
//   //   {
//   //     if( d["UNIT"] == "selectUnit")
//   //           {
//   //               return d;
//   //           }
//   //
//   //       })
//   //   // var nest = d3.nest()
//   //   //   .key(function(d) { return d.UNIT; })
//   //   //   .rollup(function(d) { return d3.sum(d, function(d) { return d.AREA; }); })
//   //   //   .entries(dataset);
//   //   // for (var d = 0; d < dataset.length; d++) {
//   //   //   if(dataset[d].UNIT == selectUnit){
//   //   // 		//data1Array.push(parseFloat(data1[d].unit))
//   //   //     console.log(dataset[d]);
//   //   //     }
//   //   // 	}
//   //   data = filteredData;
//   //   //data = nest;
//   //   });
//   // }
//   //
//   // var data;
//   // function selectData(selectUnit) {
//   //   d3.csv("data/EUP_CURRENT_LAND_USE.csv", function(d) {
//   //     return {
//   //       landUse : d.LAND_USE,
//   //       unit : d.UNIT,
//   //       landUseClass : d.CURRENT_LAND_USE_CLASS,
//   //       area : +d.AREA
//   //     };
//   //   }).then(function(dataset) {
//   //     var nest = d3.nest()
//   //       .key(function(d) { return d.UNIT; })
//   //       .entries(dataset);
//   //     console.log(nest);
//   //     data = nest;
//   //   });
//   // }
//     // var dataArray = [];
//     // //dataset.filter(function(d){return d.UNIT == selectUnit;});
//   	// for (var d = 0; d < dataset.length; d++) {
//     //   if(dataset[d].UNIT == selectUnit){
//     //     dataArray.push([+dataset[d].UNIT, +dataset[d].CURRENT_LAND_USE_CLASS, +dataset[d].AREA]);
//     //   }
//   	// }
//     // console.log(dataArray);
//     //data = dataset.filter(function(d){return d.UNIT == selectUnit;});
//     //data = dataset;
//     //console.log(data.filter(function(d){return d.UNIT == selectUnit;}));
//
//
//
// //var width=800;
// // var treeMapHeight=400;
// //
// // var treeContainerWidth = +d3.select("#treemap").style('width').slice(0, -2)
// // var treeMap = d3.select("#treemap").append("svg").attr("width",treeContainerWidth).attr("height",treeMapHeight);
// //
// //
// // // data = {
// // //     "name": "A1",
// // //     "children": [
// // //       {
// // //         "name": "B1",
// // //         "children": [
// // //           {
// // //             "name": "C1",
// // //             "value": 100
// // //           },
// // //           {
// // //             "name": "C2",
// // //             "value": 300
// // //           },
// // //           {
// // //             "name": "C3",
// // //             "value": 200
// // //           }
// // //         ]
// // //       },
// // //       {
// // //         "name": "B2",
// // //         "value": 200
// // //       }
// // //     ]
// // //   };
// //
// //   var treemapLayout = d3.treemap()
// //     .size([treeContainerWidth, treeMapHeight])
// //     .paddingOuter(0);
//
//   // var nest = d3.nest()
//   //   .key(function(d) { return d.UNIT; })
//   //   .entries(data);
//     //.rollup(function(d) { return d3.sum(d, function(d) { return d.AREA; }); })
//
//
//     //console.log("nested " + nest);
//
//   // var rootNode = d3.hierarchy(nest)
//   // .sum(function(d) { return d.values; });
//   //groupByName = d3.group(data, d => d.name)
//
// //   var rootNode = d3.hierarchy(data);
// // console.log(rootNode);
// //     rootNode.sum(function(d) {
// //       return d.area;
// //     });
// //
// //     console.log(rootNode);
// //
// //   treemapLayout(rootNode);
// //
// //   var nodes = treeMap
// //     .selectAll('g')
// //     .data(rootNode.leaves())
// //     .enter()
// //     .append('g')
// //     .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'});
// //
// //   nodes
// //     .append('rect')
// //     .attr('width', function(d) { return d.x1 - d.x0; })
// //     .attr('height', function(d) { return d.y1 - d.y0; });
// //
// //   nodes
// //     .append('text')
// //     .attr('dx', 4)
// //     .attr('dy', 14)
// //     .text(function(d) {
// //       return d.currentLandUse;
// //     });
// //   }
//
//
//     // var nodes = treeMap
//     // .selectAll("g > *").remove();
//     //   // use this information to add rectangles:
//     //   nodes
//     //   .selectAll("rect")
//     //   .data(rootNode.descendants())
//     //   .enter()
//     //   .append("rect")
//     //     .attr('x', function (d) { return d.x0; })
//     //     .attr('y', function (d) { return d.y0; })
//     //     .attr('width', function (d) { return d.x1 - d.x0; })
//     //     .attr('height', function (d) { return d.y1 - d.y0; })
//     //     .style("stroke", "black");
//         // .style("fill", function(d){return color (col(d.data.key))})
//         // .on("mouseover", function(d) { return tooltip.style("visibility", "visible").text(d.data.key + " " + d.value );})
//         // .on("mousemove", function() { return tooltip.style("top", (event.pageY - 30) + "px").style("left", event.pageX + "px");})
//         // .on("mouseout", function() { return tooltip.style("visibility", "hidden");});
