
var eupData = [];
var eupFiltered;
var land;
var desc;


function parseData(selectUnit) {

  document.getElementById("unit").innerHTML = " ";
  document.getElementById("use").innerHTML = " ";
  document.getElementById("description").innerHTML = " ";
  document.getElementById("minGreenArea").innerHTML = " ";
  document.getElementById("buldingDesc").innerHTML = " ";
  document.getElementById("buildingsPerHa").innerHTML = " ";
  document.getElementById("popDensity").innerHTML = " ";
  document.getElementById("area").innerHTML = " ";
  document.getElementById("cna").innerHTML = " ";
  document.getElementById("cnb").innerHTML = " ";
  document.getElementById("cnc").innerHTML = " ";
  document.getElementById("cnd").innerHTML = " ";
  document.getElementById("station").innerHTML = " ";

  var promises = [d3.csv("data/EUP_select_CN.csv", function(d) {
    eupData.push({
      eupunit: d.UNIT,
      euplandUse: d["LAND USE"],
      eupSpatialAct: d["SPATIAL ACT"],
      eupConstArea: d["AMOUNT OF CONSTRUCTED AREA"],
      eupMinGreen: d["MIN GREEN AREA"],
      eupbuildDesc: d["BUILDING DESCRIPTION"],
      euparea: +d.AREA,
      eupCnA: +d["CN A"],
      eupCnB: +d["CN B"],
      eupCnC: +d["CN C"],
      eupCnD: +d["CN D"],
      eupCurrBuilds: +d["CURRENT BUILDINGS PER ha"],
      eupCurrRes: +d["CURRENT RESIDENTS PER ha"],
      eupCurrPopDens: d["CURRENT POPULATION DENSITY"],
      eupRainStat: d["RAIN STATION"],
      eupOls: +d.OLS,
      eupL: +d.L
    });
  }), d3.json("data/Translation/LAND_USE_EN.json")];


  var dataPromises = Promise.all(promises);

  dataPromises.then(function(data) {

   eupFiltered = eupData.filter(function(d)
     {
       if( d.eupunit == selectUnit)
             {
                 return d;
             }

         });
   eupData = eupFiltered;

   console.log(eupData);
   console.log(eupData[0].eupunit);
   console.log(eupData.euparea);

   land = eupData[0].euplandUse;
   desc = data[1][land];

      document.getElementById("unit").innerHTML = eupData[0].eupunit;
      document.getElementById("use").innerHTML = eupData[0].euplandUse;
 			document.getElementById("description").innerHTML = desc;
 			document.getElementById("minGreenArea").innerHTML = eupData[0].eupMinGreen;
 			document.getElementById("buldingDesc").innerHTML = eupData[0].eupbuildDesc;
      document.getElementById("buildingsPerHa").innerHTML = eupData[0].eupCurrBuilds;
 			document.getElementById("popDensity").innerHTML = eupData[0].eupCurrPopDens;
 			document.getElementById("area").innerHTML = eupData[0].euparea;
 			document.getElementById("cna").innerHTML = eupData[0].eupCnA;
 			document.getElementById("cnb").innerHTML = eupData[0].eupCnB;
 			document.getElementById("cnc").innerHTML = eupData[0].eupCnC;
 			document.getElementById("cnd").innerHTML = eupData[0].eupCnD;
 			document.getElementById("station").innerHTML = eupData[0].eupRainStat;
 });
}
