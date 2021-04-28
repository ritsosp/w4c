var sbheight = +d3.select("#stackedBar").style('height').slice(0, -2);
var sbwidth = +d3.select("#stackedBar").style('width').slice(0, -2);

var width = 40;
var height = 225;

var margin = {top: 20, right: 40, bottom: 10, left: (sbwidth - width)/2};

var volBar = d3.select("#stackedBar")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var datavol = [];
  var newarrayvol = [];
  var filtDatavol;

  var soilType = 1;

  var cni;
  var area;
  var l;
  var ols;
  var cc = 1.05;
  var pti;




var barW = 75;
var areaH = 175;
var ellipseHorizonR = barW / 2;
var ellipseVerticalR = 5;
var barH = areaH - ellipseVerticalR * 2;

var volCylinder = d3.select('#cylinder')
  .append('svg')
  .attr('width', barW)
  .attr('height', areaH)
  .append('g');


function rainLevel(mm){
  return pti = mm;
}

function selectedchange(climatechange){
  return cc = climatechange;
}


function selectedSoil(soilselection){
      if(soilselection == "A"){
          soilType = 1;
      } else if(soilselection == "B"){
          soilType = 2;
      } else if(soilselection == "C"){
          soilType = 3;
      } else if(soilselection == "D"){
          soilType = 4;
      }

      return soilType;
}



function volumeData(selectUnit){

      //pti = value;

      console.log("selected unit = " + selectUnit);

      var promises = [d3.csv("data/CNv_calculated.csv"),d3.csv("data/EUP_CURRENT_LAND_USE.csv"),d3.csv("data/EUP_select_CN.csv", function(d) {
        datavol.push({
          unit: d.UNIT,
          landUse: d.LAND_USE,
          area: +d.AREA,
          cna: +d["CN A"],
          cnb: +d["CN B"],
          cnc: +d["CN C"],
          cnd: +d["CN D"],
          ols: +d.OLS,
          l: +d.L
        });
      }),
        d3.csv("data/Land_use_CN_range.csv"),d3.csv("data/Rain_data.csv"),d3.csv("data/Soil_type.csv")];

      var dataPromises = Promise.all(promises)

      dataPromises.then(function(data) {
        console.log(datavol);

          // filteredData = data[2].filter(function(d)
          //     {
          //       if( d.UNIT == selectUnit)
          //             {
          //                 if(soilType == 1){
          //                   cni = d.CN_A;
          //                 } else if(soilType == 2){
          //                   cni = d.CN_B;
          //                 } else if(soilType == 3){
          //                   cni = d.CN_C;
          //                 } else if(soilType == 4){
          //                   cni = d.CN_D;
          //                 }
          //
          //                 area = d.AREA;
          //                 l = d.L;
          //                 ols = d.OLS;
          //
          //                 pt = d3.sum(data.map(function(d){ return d['5-year']}))/1440;
          //             }
          //             console.log(cni, area, l, ols, d);
          //           return cni, area, l, ols, d;
          //         });

                  filtDatavol = datavol.filter(function(d)
                    {
                      if( d.unit == selectUnit)
                            {
                              console.log(d);
                              return d;
                            }

                        });
                  datavol = filtDatavol;
                  console.log(datavol[0].area);

                  if(soilType == 1){
                    cni = +datavol[0].cna;
                  } else if(soilType == 2){
                    cni = +datavol[0].cnb;
                  } else if(soilType == 3){
                    cni = +datavol[0].cnc;
                  } else if(soilType == 4){
                    cni = +datavol[0].cnd;
                  }
                  area = +datavol[0].area;
                  l = +datavol[0].l;
                  ols = +datavol[0].ols;





                  // console.log("data" + data);
                  //
                  // console.log("cni " + cni);
                  // console.log("area " + area);
                  // console.log("l " + l);
                  // console.log("ols " + ols);
                  // console.log("cc " + cc);
                  // console.log("pt " + pt);
                  // console.log("pti " + pti);


                  var Ia = 2.4;
                  var Sr = (25400 - 254*(cni)) / cni;
                  var Tr = Math.pow(l, 0.8) * (Math.pow((Sr + 25.4),0.7) / (28.14 * Math.sqrt(ols))) * 60;
                  var Pe = cc * ((pti - Ia)**2 / (pti - Ia + Sr));
                  var Pu = pti - Pe;
                  var Vt = area * pti;
                  var Ve = area * Pe;
                  var Vu = Vt - Ve;

                  console.log("ia " + Ia);
                  console.log("cni " + cni);
                  console.log("tr " + Tr);
                  console.log("sr " + Sr);
                  console.log("pu " + Pu);
                  console.log("pe " + Pe);
            /* Data in strings like it would be if imported from a csv */

              var data = [
                {group: "banana", pu: Pu, pe: Pe, empty: (200-(Pu + Pe))}
              ];
              // List of subgroups = header of the csv files = soil condition here
              //var subgroups = data.slice(0)
              var subgroups = d3.keys(data[0]).slice(1);
              console.log("subgroups" + subgroups);
              // List of groups = species here = value of the first column called group -> I show them on the X axis
              var groups = d3.map(data, function(d){return(d.group)}).keys();
              console.log("groups" + groups);
              // Add X axis
              var x = d3.scaleBand()
                  .domain(groups)
                  .range([0, width]);

                  var y = d3.scaleLinear()
                    .domain([0, 200])
                    .range([ height, 0 ]);
                  volBar.append("g")
                  .attr("class", "axisY")
                  .attr("transform", "translate(45,0)")
                    .call(d3.axisRight(y));


              // svg.append("g")
              //   .attr("transform", "translate(0," + height + ")")
              //   .call(d3.axisBottom(x).tickSizeOuter(0));

              // Add Y axis


              // color palette = one color per subgroup
              var volumecolor = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#0033cc','#99ccff','#ffffff']);

              //stack the data? --> stack per subgroup
              var stackedData = d3.stack()
                .keys(subgroups)
                (data);

              volBar.selectAll(".bars").remove();

              // Show the bars
              volBar.append("g")
                .attr("class", "bars")
                .selectAll("g")
                // Enter in the stack data = loop key per key = group per group
                .data(stackedData)
                .enter().append("g")
                  .attr("fill", function(d) { return volumecolor(d.key); })
                  .selectAll("rect")
                  // enter a second time = loop subgroup per subgroup to add all rectangles
                  .data(function(d) { return d; })
                  .enter().append("rect")
                    .attr("x", function(d) { return x(d.data.group); })
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("height", function(d) {return y(d[0]) - y(d[1]); })
                    .attr("width",x.bandwidth());



                    var data = [Ve, Vu];

                    // グラデーションを作成
                    var grad0 = volCylinder.append('defs')
                      .append('linearGradient')
                      .attr('id', 'grad0')
                      .attr('x1', '0%')
                      .attr('y1', '0%')
                      .attr('x2', '100%')
                      .attr('y2', '0%');
                    grad0.append('stop')
                      .attr('offset', '0%')
                      .attr('stop-color', '#99ccff')
                      .attr('stop-opacity', 0.7);
                    grad0.append('stop')
                      .attr('offset', '70%')
                      .attr('stop-color', '#e6f2ff')
                      .attr('stop-opacity', 0.7);
                    grad0.append('stop')
                      .attr('offset', '100%')
                      .attr('stop-color', '#99ccff')
                      .attr('stop-opacity', 0.7);

                    var grad1 = volCylinder.append('defs')
                      .append('svg:linearGradient')
                      .attr('id', 'grad1')
                      .attr('x1', '0%')
                      .attr('y1', '0%')
                      .attr('x2', '100%')
                      .attr('y2', '0%');
                    grad1.append('stop')
                      .attr('offset', '0%')
                      .attr('stop-color', '#99ccff');
                    grad1.append('stop')
                      .attr('offset', '70%')
                      .attr('stop-color', '#e6f2ff');
                    grad1.append('stop')
                      .attr('offset', '100%')
                      .attr('stop-color', '#99ccff');

                    var grad2 = volCylinder.append('svg:defs')
                      .append('linearGradient')
                      .attr('id', 'grad2')
                      .attr('x1', '0%')
                      .attr('y1', '0%')
                      .attr('x2', '100%')
                      .attr('y2', '0%');
                    grad2.append('stop')
                      .attr('offset', '0%')
                      .attr('stop-color', '#0033cc');

                    grad2.append('stop')
                      .attr('offset', '70%')
                      .attr('stop-color', '#4d79ff');
                    grad2.append('stop')
                      .attr('offset', '100%')
                      .attr('stop-color', '#0033cc');

                    var maxval = data[0] + data[1];
                    console.log(maxval);

                    volCylinder.selectAll('rect').remove();
                    volCylinder.selectAll('ellipse').remove();

                    var rectY = 0;
                    volCylinder.selectAll('rect')
                      .data(data)
                      .enter()
                      .append('rect')
                      .style("stroke", "black")
                      .attr('fill', function (d, i) {
                        return 'url(#grad' + (i + 1) + ')';
                      })
                      .attr('class', function (d, i) {
                        return 'bar' + i;
                      })
                      .attr('width', barW)
                      .attr('height', function (d) {
                        return d * barH / maxval;
                      })
                      .attr('x', 0)
                      .attr('y', function (d, i) {
                        if (i === 0) {
                          return ellipseVerticalR;
                        } else {
                          rectY += data[i - 1] * barH / maxval;
                          return rectY + ellipseVerticalR;
                        }
                      });

                    var ellipseY = 0;
                    volCylinder.selectAll('ellipse')
                      .data(data)
                      .enter()
                      .append('ellipse')
                      .style("stroke", "black")
                      .attr('fill', function (d, i) {
                        return 'url(#grad2)';
                      })
                      .attr('rx', barW / 2)
                      .attr('ry', ellipseVerticalR)
                      .attr('cx', barW / 2)
                      .attr('cy', function (d, i) {
                        ellipseY += data[i] * barH / maxval;
                        return ellipseY + ellipseVerticalR;
                      });

                    volCylinder.selectAll('.top1')
                      .data(data)
                      .enter()
                      .append('ellipse')
                      .style("stroke", "black")
                      .attr('fill', 'url(#grad0)')
                      .attr('class', 'top1')
                      .attr('rx', barW / 2)
                      .attr('ry', ellipseVerticalR)
                      .attr('cx', barW / 2)
                      .attr('cy', ellipseVerticalR);


      	});

      dataPromises.catch(function() {
      	console.log('Something has gone wrong.')
      })

}




// var data = [];
// var newarray = [];
// var filteredData;
//
// var soilType = 1;
//
// var cni = 0;
// var area = 0
// var l = 0;
// var ols = 0;
// var cc = 1.05;
// var pt = 5;
//
// // function precipData(returnPeriod){
// //     pt = returnPeriod;
// //
// // }
//
// function calculations(selectUnit){
//
// //console.log(pt);
//
//
//     // Promise.all([
//     //     d3.csv("data/CNv_calculated.csv"),
//     //     d3.csv("data/EUP_CURRENT_LAND_USE.csv"),
//     //     d3.csv("data/EUP_select_CN.csv"),
//     //     d3.csv("data/Land_use_CN_range.csv"),
//     //     d3.csv("data/Rain_data.csv"),
//     //     d3.csv("data/Soil_type.csv")
//     // ]).then(function(files) {
//     //
//     //   filteredData = files[1].filter(function(d)
//     //     {
//     //       if( d.unit == selectUnit)
//     //             {
//     //                 return d;
//     //             }
//     //
//     //         });
//     //   data = filteredData;
//     //   console.log(data);
//
//     var promises = [d3.csv("data/CNv_calculated.csv"),d3.csv("data/EUP_CURRENT_LAND_USE.csv"),d3.csv("data/EUP_select_CN.csv"),
//       d3.csv("data/Land_use_CN_range.csv"),d3.csv("data/Rain_data.csv"),d3.csv("data/Soil_type.csv")];
//
//     var dataPromises = Promise.all(promises)
//
//
//     dataPromises.then(function(data) {
//         filteredData = data[2].filter(function(d)
//             {
//               if( d.UNIT == selectUnit)
//                     {
//                         if(soilType == 1){
//                           cni = d.CN_A;
//                         } else if(soilType == 2){
//                           cni = d.CN_B;
//                         } else if(soilType == 3){
//                           cni = d.CN_C;
//                         } else if(soilType == 4){
//                           cni = d.CN_D;
//                         }
//
//                         area = d.AREA;
//                         l = d.L;
//                         ols = d.OLS;
//
//                         return cni, area, l, ols, d;
//                     }
//
//                 });
//           data = filteredData;
//           //console.log(data);
//           //console.log(cni);
//
//     	});
//
//     dataPromises.catch(function() {
//     	console.log('Something has gone wrong.')
//     })
//
//
//
//     var Ia = 2.4;
//     var Sr = (25400 - 254*(cni)) / cni;
//     var Tr = l**(0.8) * ((Sr + 25.4)**(0.7) / (28.14 * Math.sqrt(ols))) * 60;
//     var Pe = cc * (pt - Ia) / (pt - Ia + Sr);
//     var Pu = pt - Pe;
//     var Vt = area * pt;
//     var Ve = area * Pe;
//     var Vu = Vt - Ve;
//
//
//
// }


// CNi value is a value for selected urban area (CN_EUP_selected.xlsx) and selected soil type
// AREA, L and OLS values are values that are defined for selected urban area (CN_EUP_selected.xlsx)
// Cc value is a value for selected climate change prediction
// PTi… values from Rain_data.xlsx
// CNi…values from CN_EUP_selected.xlsx
  // for Soil type A: CN_A
	// for Soil type B: CN_B
	// for Soil type C: CN_C
	// for Soil type D: CN_D
