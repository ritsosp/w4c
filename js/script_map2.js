//Js and Leaflet Stuff
var chorCol;
var datacol = [];
var filtData;
var c;
var getCol = d3.scaleLinear()
  .domain([0, 1])
  .range([ "#545454", "#0066CC"]);


var map =  L.map ('map', {
    attributionControl: false,
    center: [14,46],
    zoom: 8,
    minZoom: 2,
    maxZoom: 18
});



function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        //color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}



function resetHighlight(e) {
  pilotLayer.resetStyle(e.target);
    countryLayer.resetStyle(e.target);
    regionLayer.resetStyle(e.target);
    municipLayer.resetStyle(e.target);
    unitLayer.resetStyle(e.target);

}



function populateGraphs(e) {
    parseData(e.target.feature.properties.UNIT);
    selectData(e.target.feature.properties.UNIT);
    lineData(e.target.feature.properties.UNIT);
    SoilData(e.target.feature.properties.UNIT);
    volumeData(e.target.feature.properties.UNIT);
    //calculations(e.target.feature.properties.UNIT);
}




function zoomToFeature(e) {
    // if (event.shiftKey) {
    // map.fitBounds(e.target.getBounds());
    // //map.panTo(new L.LatLng(40.737, -73.923));
    // }
    // else {
    //     console.log(e.target.feature.properties.UNIT);
    //     populateGraphs(e);
    //
    // }
    map.fitBounds(e.target.getBounds());
}

//interactive layer based on the zoom

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}



function choroplethColour(e){
  d3.csv("data/CNv_calculated.csv", function(d) {
    datacol.push({
      unit: d.UNIT,
      cnv: +d.CNv
    });
    }).then(function(d) {
   filtData = datacol.filter(function(d)
     {
       if( d.unit == e)
             {
                 return d
             }

         });
      c = filtData;
      var colunit = c[0].cnv;
      function getColor(d) {
          return d > 0.5 ? '#800026' :
                 d > 0.4  ? '#BD0026' :
                 d > 0.3  ? '#E31A1C' :
                 d > 0.25  ? '#FC4E2A' :
                 d > 0.2   ? '#FD8D3C' :
                 d > 0.15   ? '#FEB24C' :
                 d > 0.1   ? '#FED976' :
                            '#FFEDA0';
      }

      chorCol = getColor(colunit);
      console.log(c[0].cnv);
      return chorCol;
 });
 console.log(chorCol);
 return chorCol;
}



var pilotLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
          //fill: choroplethColour(feature.properties.UNIT),
          weight: 1,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7,
          fillColor: choroplethColour(feature.properties.UNIT)
        };
    }
    // onEachFeature: function (feature, layer) {
    //     layer.bindPopup(feature.properties.UNIT);
    //     layer.on({
    //         mouseover: highlightFeature,
    //         mouseout: resetHighlight,
    //         click: zoomToFeature
    //     });
    // }
}).addTo(map);




var countryLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
          weight: 0.5
        };
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup("Slovenia");
    }
});



var regionLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
          weight: 0.5
        };
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.SR_UIME);
    }
});



var municipLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
          weight: 0.5
        };
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.OB_UIME);
      }
});

var unitLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
          weight: 0.5
        };
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.Id);
        layer.on({

            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
});







var geocoder = L.esri.Geocoding.geocodeService();




$.getJSON("data/maps/Country.geojson",function(data){
    countryLayer.addData(data)
    });

$.getJSON("data/maps/Region.geojson",function(data){
   regionLayer.addData(data);
    });

$.getJSON("data/maps/Municip.geojson",function(data){
    municipLayer.addData(data);
    });

$.getJSON("data/maps/F_unit.geojson",function(data){
    unitLayer.addData(data);
    });

$.getJSON("data/maps/EUP_pilot.geojson",function(data){
    pilotLayer.addData(data);
    });




// var baseLayers = {
//      "Country": countryLayer,
//      "Region": regionLayer,
//      "Municipalities": municipLayer,
//      "Units": unitLayer,
//      "EUP": pilotLayer,
//          };


// L.control.layers(baseLayers).addTo(map);
//pilotLayer.addTo(map);
// countryLayer.addTo(map);
// regionLayer.addTo(map);
// municipLayer.addTo(map);
// unitLayer.addTo(map);





// layer groups - different panes



geocoder.geocode().text('SLOVENIA').run(function (error, response) {
    if (error) {
      return;
    }

map.fitBounds(response.results[0].bounds); });
