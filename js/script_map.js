//Js and Leaflet Stuff
var chorCol = 0;
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
    countryLayer.resetStyle(e.target);
    regionLayer.resetStyle(e.target);
    municipLayer.resetStyle(e.target);
    pilotLayer.resetStyle(e.target);
    unitLayer.resetStyle(e.target);

}



function populateGraphs(e) {
    parseData(e.target.feature.properties.UNIT);
    selectData(e.target.feature.properties.UNIT);
    lineData(e.target.feature.properties.UNIT);
    SoilData(e.target.feature.properties.UNIT);
    //volumeData(e.target.feature.properties.UNIT);
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



var pilotLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
          weight: 0.5
        };
    },
    // pointToLayer: function (feature, latlng) {
    //     return new L.CircleMarker(latlng, {
    //     	radius: 10,
    //     	fillOpacity: 0.85
    //     });
    // },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.UNIT);
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        //console.log(feature.properties.UNIT);
    }
});

// pilotLayer.setStyle(function(feature) {
//     return {
//         fillColor: choroplethColour(feature.properties.UNIT)
//     }
// });


var countryLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
        	//color: "green",
          weight: 0.5
        };
    },
    // pointToLayer: function (feature, latlng) {
    //     return new L.CircleMarker(latlng, {
    //     	radius: 10,
    //     	fillOpacity: 0.85
    //     });
    // },
    onEachFeature: function (feature, layer) {
        layer.bindPopup("Slovenia");
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
});
var regionLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
        	//color: "green",
          weight: 0.5
        };
    },
    // pointToLayer: function (feature, latlng) {
    //     return new L.CircleMarker(latlng, {
    //     	radius: 10,
    //     	fillOpacity: 0.85
    //     });
    // },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.SR_UIME);
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
});

var municipLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
        	//color: "green",
          weight: 0.5
        };
    },
    // pointToLayer: function (feature, latlng) {
    //     return new L.CircleMarker(latlng, {
    //     	radius: 10,
    //     	fillOpacity: 0.85
    //     });
    // },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.OB_UIME);
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
      }
});

var unitLayer =  new L.geoJson(null, {
    style: function(feature) {
        return {
        	//color: "green",
          //fillColor: choroplethColour(feature.properties.UNIT),
          weight: 0.5
        };
    },
    // pointToLayer: function (feature, latlng) {
    //     return new L.CircleMarker(latlng, {
    //     	radius: 10,
    //     	fillOpacity: 0.85
    //     });
    // },
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
countryLayer.addTo(map);
// regionLayer.addTo(map);
// municipLayer.addTo(map);
// unitLayer.addTo(map);





// layer groups - different panes



geocoder.geocode().text('SLOVENIA').run(function (error, response) {
    if (error) {
      return;
    }

map.fitBounds(response.results[0].bounds); });

//map.setView([54.5, -4], 6);

map.on('zoomend', function() {
var zoomlevel = map.getZoom();
    if (zoomlevel  < 8){
        if (map.hasLayer(regionLayer)) {
            map.removeLayer(regionLayer);
        } else {
            console.log("no point layer active");
        }
    }
    if (zoomlevel >= 8){
        if (map.hasLayer(regionLayer)){
            console.log("layer already added");
        } else {
            map.addLayer(regionLayer);
        }
    }
console.log("Current Zoom Level =" + zoomlevel)
});

map.on('zoomend', function() {
var zoomlevel = map.getZoom();
    if (zoomlevel  < 10){
        if (map.hasLayer(municipLayer)) {
            map.removeLayer(municipLayer);
        } else {
            console.log("no point layer active");
        }
    }
    if (zoomlevel >= 10){
        if (map.hasLayer(municipLayer)){
            console.log("layer already added");
        } else {
            map.addLayer(municipLayer);
        }
    }
console.log("Current Zoom Level =" + zoomlevel)
});

map.on('zoomend', function() {
var zoomlevel = map.getZoom();
    if (zoomlevel  < 11){
        if (map.hasLayer(unitLayer)) {
            map.removeLayer(unitLayer);
        } else {
            console.log("no point layer active");
        }
    }
    if (zoomlevel >= 11){
        if (map.hasLayer(unitLayer)){
            console.log("layer already added");
        } else {
            map.addLayer(unitLayer);
        }
    }
console.log("Current Zoom Level =" + zoomlevel)
});

map.on('zoomend', function() {
var zoomlevel = map.getZoom();
    if (zoomlevel  < 12){
        if (map.hasLayer(pilotLayer)) {
            map.removeLayer(pilotLayer);
        } else {
            console.log("no point layer active");
        }
    }
    if (zoomlevel >= 12){
        if (map.hasLayer(pilotLayer)){
            console.log("layer already added");
        } else {
            map.addLayer(pilotLayer);
            //pilotLayer({ style: style }).addTo(map);
        }
    }
console.log("Current Zoom Level =" + zoomlevel)
});


function style(feature){
  return {
        weight: 2,
        fillOpacity: 0,
        weight: 0.5,
        color: choroplethColour(feature.properties.UNIT)
      };
}




// var countrydata = $.getJSON("data/maps/Country.geojson",function(data){
//                 // L.geoJson function is used to parse geojson file and load on to map
//                 return data;
//                 });


// var regiondata = $.getJSON("data/maps/Region.geojson",function(data){
//                 // L.geoJson function is used to parse geojson file and load on to map
//                 return data;
//                 });



// var municipdata = $.getJSON("data/maps/Municip.geojson",function(data){
//             // L.geoJson function is used to parse geojson file and load on to map
//                 return data;
//                 });



// var unitdata = $.getJSON("data/maps/F_unit.geojson",function(data){
//                 // L.geoJson function is used to parse geojson file and load on to map
//                 return data;
//                 });



// var pilotdata = $.getJSON("data/maps/EUP_pilot.geojson",function(data){
//                 // L.geoJson function is used to parse geojson file and load on to map
//                 return data;
//                 });






               // L.geoJson(countrydata.responseJSON).addTo(map);
               // L.geoJson(regiondata).addTo(map);
               // L.geoJson(municipdata).addTo(map);
               // L.geoJson(unitdata).addTo(map);
               // L.geoJson(pilotdata).addTo(map);













// $.getJSON("data/maps/Country.geojson",function(countrydata){
//     // L.geoJson function is used to parse geojson file and load on to map
//     L.geoJson(countrydata).addTo(map);
//     });


// $.getJSON("data/maps/Region.geojson",function(regiondata){
//         // L.geoJson function is used to parse geojson file and load on to map
//         L.geoJson(regiondata).addTo(map);
//         });



// $.getJSON("data/maps/Municip.geojson",function(municipdata){
//             // L.geoJson function is used to parse geojson file and load on to map
//             L.geoJson(municipdata).addTo(map);
//             });



// $.getJSON("data/maps/F_unit.geojson",function(unitdata){
//                 // L.geoJson function is used to parse geojson file and load on to map
//                 L.geoJson(unitdata).addTo(map);
//                 });



// $.getJSON("data/maps/EUP_pilot.geojson",function(pilotdata){
//                 // L.geoJson function is used to parse geojson file and load on to map
//                 L.geoJson(pilotdata).addTo(map);
//                 });


//                 L.geoJson(countrydata).addTo(map);
//                 L.geoJson(regiondata).addTo(map);
//                 L.geoJson(municipdata).addTo(map);
//                 L.geoJson(unitdata).addTo(map);
//                 L.geoJson(pilotdata).addTo(map);
