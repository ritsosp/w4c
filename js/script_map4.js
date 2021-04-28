/* * * * * * * * * * * * * * * * * * * * */
/* Water4Cities Leafletjs-based maps     */
/* Editor: Panos Ritsos & Casey Nolan    */
/* Date: 22/03/20220                     */
/* * * * * * * * * * * * * * * * * * * * */

var landUseData;
var activeLayer = "Country";
var chorCol;
var datacol = [];
var filtData;
var colunit;
var c;
var toggle = false;

d3.csv("data/CNv_calculated.csv").then(function (data) {
  data.forEach(function (d) {
    datacol.push({
      unit: d.UNIT,
      cnv: +d.CNv,
    });
  });

  var map = L.map("map", {
    attributionControl: false,
    center: [14, 46],
    zoom: 8,
    minZoom: 2,
    maxZoom: 18,
    weight: 1,
  });

  var backLayer = L.tileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ["a", "b", "c"],
    }
  ).addTo(map);

  function togglePoints() {
    if (!toggle) {
      map.removeLayer(backLayer);
    } else {
      map.addLayer(backLayer);
    }
    toggle = !toggle;
  }

  var styleCountry = {
    color: "green",
    fillColor: "yellow",
    weight: 1,
    fillOpacity: 0.2,
  };

  var styleRegion = {
    color: "green",
    fillColor: "cyan",
    weight: 1,
    fillOpacity: 0.2,
  };

  var styleMunicipality = {
    color: "green",
    fillColor: "pink",
    weight: 1,
    fillOpacity: 0.2,
  };

  var styleEUP = {
    color: "green",
    fillColor: "blue",
    weight: 1,
    fillOpacity: 0.2,
  };

  var stylePilot = {
    color: "green",
    fillColor: "red",
    weight: 1,
    fillOpacity: 0.2,
  };

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 2,
      dashArray: "",
      fillOpacity: 0.5,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    countryLayer.setStyle(styleCountry);
    regionLayer.setStyle(styleRegion);
    municipLayerNonInteractive.setStyle(styleMunicipality);
    municipLayer.setStyle(styleMunicipality);
    unitLayer.setStyle(styleEUP);
    pilotLayer.setStyle(stylePilot);

    console.log("resetting");
    map.closePopup();
  }

  function populateGraphs(e) {
    if (typeof e.target.feature.properties.UNIT !== "undefined") {
      parseData(e.target.feature.properties.UNIT);
      selectData(e.target.feature.properties.UNIT);
      lineData(e.target.feature.properties.UNIT);
      SoilData(e.target.feature.properties.UNIT);

      console.log("populating graphs for: " + e.target.feature.properties.UNIT);
    }
  }

  function clearGraphs(e) {
    clearData(e.target.feature.properties.UNIT);
  }

  // Zoom to feature when Shift is pressed
  function zoomToFeature(e) {
    if (event.shiftKey) {
      map.fitBounds(e.target.getBounds());
    } else {
      populateGraphs(e);
    }
  }

  // Country Layer - Interactive
  var countryLayer = new L.geoJson(null, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("SLOVENIA");
      layer.setStyle(styleCountry);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  // Region Layer - Interactive
  var regionLayer = new L.geoJson(null, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.SR_UIME);
      layer.setStyle(styleRegion);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  // Municipality Layer - Interactive
  var municipLayer = new L.geoJson(null, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.OB_UIME);
      layer.setStyle(styleMunicipality);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  // Municipality Layer - Non-interactive
  var municipLayerNonInteractive = new L.geoJson(null, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.OB_UIME);
      layer.setStyle(styleCountry);
      layer.on({
        interactive: false,
      });
    },
  });

  // Unit Layer - Interactive
  var unitLayer = new L.geoJson(null, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("F Unit");
      layer.setStyle(styleEUP);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  // Pilot Layer - Interactive
  var pilotLayer = new L.geoJson(null, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.UNIT);
      layer.setStyle(stylePilot);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  function getColor(e) {
    for (var i = 0; i < datacol.length; i++) {
      if (datacol[i].unit == e) {
        chorCol = datacol[i].cnv;
      }
    }
    //console.log(chorCol);
    if (chorCol > 0.8) {
      colunit = "#118504";
    } else if (chorCol > 0.6) {
      colunit = "#52A340";
    } else if (chorCol > 0.4) {
      colunit = "#7FBF67";
    } else if (chorCol > 0.2) {
      colunit = "#97A68F";
    } else {
      colunit = "#858C80";
    }

    return colunit;
  }

  // Add GeoJSON data to Layers
  $.getJSON("data/maps/Country.geojson", function (data) {
    countryLayer.addData(data);
  });
  $.getJSON("data/maps/Region.geojson", function (data) {
    regionLayer.addData(data);
  });
  $.getJSON("data/maps/Municip.geojson", function (data) {
    municipLayer.addData(data);
  });
  $.getJSON("data/maps/Municip.geojson", function (data) {
    municipLayerNonInteractive.addData(data);
  }); // Notice non-interactive layer
  $.getJSON("data/maps/F_unit.geojson", function (data) {
    unitLayer.addData(data);
  });
  $.getJSON("data/maps/EUP_pilot.geojson", function (data) {
    pilotLayer.addData(data);
  });

  // Handle Zoom and call layer manager
  map.on("zoomend", function (e) {
    zoom_based_layerchange();
  });

  // Clean map for layer manager
  function clean_map() {
    map.eachLayer(function (layer) {
      if (layer instanceof L.GeoJSON) {
        //Do marker specific actions here
        map.removeLayer(layer);
      }
    });
  }

  // Layer Manager - activating layeras based on Zoom level
  function zoom_based_layerchange() {
    $("#zoomlevel").html(map.getZoom());
    var currentZoom = map.getZoom();

    if (currentZoom <= 7) {
      clean_map();
      countryLayer.addTo(map);
      $("#layername").html("Country");
      activeLayer = "Country";
    } else {
      switch (currentZoom) {
        case 8:
          clean_map();
          regionLayer.addTo(map);
          $("#layername").html("Region");
          activeLayer = "Region";
          break;
        case 9:
          clean_map();
          municipLayer.addTo(map);
          $("#layername").html("Municipality");
          activeLayer = "Municipality";
          break;
        case 10:
          clean_map();
          municipLayer.addTo(map);
          $("#layername").html("Municipality");
          activeLayer = "Municipality";
          break;
        case 11:
          clean_map();
          municipLayer.addTo(map);
          $("#layername").html("Municipality");
          activeLayer = "Municipality";
          break;
        case 12:
          clean_map();
          municipLayerNonInteractive.addTo(map);
          unitLayer.addTo(map);
          $("#layername").html("Unit");
          activeLayer = "Unit";
          break;
        case 14:
          clean_map();
          municipLayerNonInteractive.addTo(map);
          pilotLayer.addTo(map);
          $("#layername").html("Unit");
          activeLayer = "Unit";
          break;
        default:
          // do nothing
          break;
      }
    }
  }

  var geocoder = L.esri.Geocoding.geocodeService();

  // Fit data to map
  geocoder
    .geocode()
    .text("SLOVENIA")
    .run(function (error, response) {
      if (error) {
        return;
      }

      map.fitBounds(response.results[0].bounds);
    });
});
