var chorCol;
var datacol = [];
var filtData;
var colunit;
var c;

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
  });

  function style(feature) {
    return {
      fillColor: "#52A340",
      weight: 0.3,
      opacity: 0.5,
      color: "black",
      fillOpacity: 0.1,
    };
  }

  function highlightFeature(e) {
    pilotLayer.bringToFront();
    var layer = e.target;

    layer.setStyle({
      weight: 0.5,
      fillColor: "white",
      dashArray: "",
      fillOpacity: 0.7,
    });

    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //     layer.bringToFront();
    // }
  }

  function resetHighlight(e) {
    countryLayer.resetStyle(e.layer);
    regionLayer.resetStyle(e.layer);
    municipLayer.resetStyle(e.layer);
    pilotLayer.resetStyle(e.layer);
    unitLayer.resetStyle(e.layer);
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
    if (e.target.options.name == "pilotLayer") {
      map.fitBounds(unitLayer.getBounds());
      populateGraphs(e);
    } else {
      if (!event.shiftKey) {
        map.fitBounds(e.target.getBounds());
        populateGraphs(e);
        //map.panTo(new L.LatLng(40.737, -73.923));
      } else {
        console.log(e.target.feature.properties.UNIT);
        populateGraphs(e);
      }
    }
    //map.fitBounds(e.target.getBounds());
  }

  // function onEachFeature(feature, layer) {
  //     layer.on({
  //         mouseover: highlightFeature,
  //         mouseout: resetHighlight,
  //         click: zoomToFeature
  //     });
  // }

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

  $.getJSON("data/maps/Country.geojson", function (data) {
    countryLayer.addData(data);
  });

  $.getJSON("data/maps/Region2.geojson", function (data) {
    regionLayer.addData(data);
  });

  $.getJSON("data/maps/Municip1.geojson", function (data) {
    municipLayer.addData(data);
  });

  $.getJSON("data/maps/F_unit.geojson", function (data) {
    unitLayer.addData(data);
  });

  $.getJSON("data/maps/EUP_pilot.geojson", function (data) {
    pilotLayer.addData(data);
  });

  var countryLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        fillColor: "#52A340",
        weight: 2,
        opacity: 0.75,
        color: "black",
        fillOpacity: 0.7,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Slovenia");
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  }).addTo(map);

  var regionLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        fillColor: "#52A340",
        weight: 2,
        opacity: 0.5,
        color: "black",
        fillOpacity: 0.7,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(feature.properties.SR_UIME, {
        permanent: true,
        direction: "center",
        opacity: 1.0,
      });
      layer.bindPopup(feature.properties.SR_UIME);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  var municipLayer = L.geoJson(data, {
    style: style,
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(feature.properties.OB_UIME, {
        permanent: true,
        direction: "center",
        opacity: 1.0,
      });
      layer.bindPopup(feature.properties.OB_UIME);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  var unitLayer = L.geoJson(data, {
    style: style,
    onEachFeature: function (feature, layer) {
      //layer.bindPopup(feature.properties.Id);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  var pilotLayer = L.geoJson(data, {
    name: "pilotLayer",
    style: function (feature) {
      return {
        fillColor: getColor(feature.properties.UNIT),
        color: "black",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.7,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.UNIT);
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    },
  });

  var geocoder = L.esri.Geocoding.geocodeService();

  geocoder
    .geocode()
    .text("SLOVENIA")
    .run(function (error, response) {
      if (error) {
        return;
      }
      map.fitBounds(response.results[0].bounds);
    });

  map.on("zoomend", function () {
    var zoomlevel = map.getZoom();
    if (zoomlevel < 8) {
      if (map.hasLayer(regionLayer)) {
        map.removeLayer(regionLayer);
      } else {
        console.log("no point layer active");
      }
    }
    if (zoomlevel >= 8) {
      if (map.hasLayer(regionLayer)) {
        console.log("layer already added");
      } else {
        map.addLayer(regionLayer);
      }
    }
    console.log("Current Zoom Level =" + zoomlevel);
  });

  map.on("zoomend", function () {
    var zoomlevel = map.getZoom();
    if (zoomlevel < 9) {
      if (map.hasLayer(municipLayer)) {
        map.removeLayer(municipLayer);
      } else {
        console.log("no point layer active");
      }
    }
    if (zoomlevel >= 9) {
      if (map.hasLayer(municipLayer)) {
        console.log("layer already added");
      } else {
        map.addLayer(municipLayer);
      }
    }
    console.log("Current Zoom Level =" + zoomlevel);
  });

  map.on("zoomend", function () {
    var zoomlevel = map.getZoom();
    if (zoomlevel < 11) {
      if (map.hasLayer(unitLayer)) {
        map.removeLayer(unitLayer);
      } else {
        console.log("no point layer active");
      }
    }
    if (zoomlevel >= 11) {
      if (map.hasLayer(unitLayer)) {
        console.log("layer already added");
      } else {
        map.addLayer(unitLayer);
      }
    }
    console.log("Current Zoom Level =" + zoomlevel);
  });

  map.on("zoomend", function () {
    var zoomlevel = map.getZoom();
    if (zoomlevel < 12) {
      if (map.hasLayer(pilotLayer)) {
        map.removeLayer(pilotLayer);
      } else {
        console.log("no point layer active");
      }
    }
    if (zoomlevel >= 12) {
      if (map.hasLayer(pilotLayer)) {
        console.log("layer already added");
      } else {
        map.addLayer(pilotLayer);
        //pilotLayer({ style: style }).addTo(map);
      }
    }
    console.log("Current Zoom Level =" + zoomlevel);
  });
});
