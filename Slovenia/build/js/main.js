// Map configuration
var layers = [];
var map_config = {
  w: 800,
  h: 800,
  centered: null,
  target: 2,
  projection: null,
  path: null,
  prev_path: null,
  dom_layer: document.getElementById("map-layers"),
  zoom_layer: 0
}; // Defines layers of the map, includes:
// name: Informal name,
// formal_name: Formal displayable name,
// data: JSON map data
// zoom: Is a zoomable layer

var map_layers = [{
  name: "base_layer",
  formal_name: "Slovenia",
  data: d3.json("data/slovenia.json"),
  zoom: false
}, {
  name: "next_layer",
  formal_name: "Regions",
  data: d3.json("data/slovenia1.json"),
  zoom: true
}, {
  name: "more_layer",
  formal_name: "Municipality",
  data: d3.json("data/slovenia2.json"),
  zoom: true
}];
/**
 * Returns the names components of the map_layers array.
 * @returns {Array<String>} Names
 */

function get_map_names() {
  var n = [];
  map_layers.map(function (v) {
    return n.push(v.name);
  });
  return n;
}
/**
 * Returns the formal name components of the
 * map layers array.
 * @returns {Array<String>} Formal names
 */


function get_map_formal_names() {
  var n = [];
  map_layers.map(function (v) {
    return n.push(v.formal_name);
  });
  return n;
}
/**
 * Returns the data components of the
 * map layers array.
 * Note that this is a Promise!
 * @returns {Promise} Data ready to load
 */


function get_map_data() {
  var d = [];
  map_layers.forEach(function (v) {
    return d.push(v.data);
  });
  return d;
}
/**
 * Returns the zoom components of the
 * map layers array.
 * @returns {Array<Boolean>} Zoom value
 */


function get_map_zoom() {
  var z = [];
  map_layers.forEach(function (v) {
    return z.push(v.zoom);
  });
  return z;
}
/**
 * Master function for map.
 * Loads in data and generates and renders layers
 */


Promise.all(get_map_data()).then(function (values) {
  map_config.projection = d3.geoEqualEarth().fitSize([map_config.w, map_config.h], values[0]).center([0, 0]);
  map_config.path = d3.geoPath().projection(map_config.projection); // Construct the layer data object

  construct_layer_object(values, get_map_names(), layers); // Creates the layers

  create_layers(); // Handle zooming...

  get_zoom_layer(); // Create UI Elements

  generate_map_layer_list(); // Finish loading

  document.getElementById("loading").classList.add("hide");
});
/**
 * Handles initial creation and display of
 * the map layers
 */

function create_layers() {
  for (var i = 0; i < Object.keys(layers).length; ++i) {
    render_layer(i);
  }

  display_layers();
}
/**
 * Render a layer contained in the layers array
 * @param {Number} i Index to render
 */


function render_layer(i) {
  layers[i].ele.selectAll("path").data(layers[i].data.features).enter().append("path").attr("class", "map_area_" + i).attr("d", map_config.path);
}
/**
 * Checks the visibility of each layer and
 * passes to hide or display unctions
 */


function display_layers() {
  for (var i = 0; i < Object.keys(layers).length; ++i) {
    if (layers[i].active) {
      show_layer(i);
    } else {
      hide_layer(i);
    }
  } // Refresh layers to fir current zoom level..


  map_refresh(map_config.centered || layers[Object.keys(layers).length - 1].data); // Renew zoom logic..

  get_zoom_layer();
}
/**
 * Show a layer contained in the layers array
 * @param {Number} i Index to show
 */


function show_layer(i) {
  layers[i].ele.selectAll("path").attr("visibility", "visible");
  layers[i].ele.style("z-index", i);
}
/**
 * Hide a layer contained in the layers array
 * @param {Number} i Index to show
 */


function hide_layer(i) {
  layers[i].ele.selectAll("path").attr("visibility", "hidden");
  layers[i].ele.style("z-index", -1);
}
/**
 * Refreshes the map layers, accounting for change
 * in scale and position, so all remain linked.
 * @param {Object} values Data values
 */


function map_refresh(values) {
  var t0 = map_config.projection.translate();
  var s0 = map_config.projection.scale();
  map_config.projection.fitSize([map_config.w, map_config.h], values);
  var interpolateTranslate = d3.interpolate(t0, map_config.projection.translate());
  var interpolateScale = d3.interpolate(s0, map_config.projection.scale());

  var interpolator = function interpolator(t) {
    map_config.projection.scale(interpolateScale(t)).translate(interpolateTranslate(t));

    for (var i = 0; i < Object.keys(layers).length; ++i) {
      if (layers[i].active) {
        layers[i].ele.selectAll("path").attr("d", map_config.path);
      }
    }
  };

  d3.transition().duration(500).tween("projection", function () {
    return interpolator;
  });
}
/**
 * Gets the current zoom layer, which is the
 * layer which is active and zoomable.
 * Uses the last element that matches.
 */


var get_zoom_layer = function get_zoom_layer() {
  // let zoom = get_map_zoom();
  // // We want the LAST ACTIVE true element..
  // let z = zoom.lastIndexOf(true);
  var zoom = [];
  layers.map(function (l) {
    return zoom.push(l.active && l.zoom);
  });
  var z = zoom.lastIndexOf(true);

  if (z != -1) {
    layers[map_config.zoom_layer].ele.selectAll("path").classed("active", false);
    map_config.zoom_layer = z;
    layers[map_config.zoom_layer].ele.selectAll("path").on("click", function (d) {
      clicked(d);
    });
  }
};
/**
 * Zooms in or out of a selected map area
 * @param {Object} d Data
 */


function clicked(d) {
  map_config.centered = map_config.centered !== d && d;
  layers[map_config.zoom_layer].ele.selectAll("path").classed("active", function (d) {
    return d === map_config.centered;
  });
  map_refresh(map_config.centered || layers[Object.keys(layers).length - 1].data);
}
/**
 * Has two purposes:
 * 1. Construct SVG layers for each input layer.
 * 2. Construct an object which holds each layers name,
 *    element and data.
 * @param {Array<JSON>} values Map path data
 * @param {Array<String>} names Map layer name
 * @param {Array<Object>} output Object to save data to.
 */


function construct_layer_object(values, names, output) {
  names.forEach(function (v, i) {
    var obj = {};
    d3.select("div#map").append("svg").attr("id", v).attr("width", map_config.w).attr("height", map_config.h).style("z-index", i);
    obj.name = v;
    obj.ele = d3.select("#".concat(v));
    obj.data = values[i];
    obj.active = i == 0 ? true : false;
    obj.zoom = map_layers[i].zoom;
    output.push(obj);
  });
}
/**
 * Returns the zoom components of the
 * layers array.
 * @returns {Array<Boolean>} Zoom value
 */


function get_layer_zoom() {
  var z = [];
  layers.forEach(function (v) {
    return z.push(v.zoom);
  });
  return z;
}
/**
 * Returns the active components of the
 * layers array.
 * @returns {Array<Boolean>} Active value
 */


function get_layer_active() {
  var z = [];
  layers.forEach(function (v) {
    return z.push(v.active);
  });
  return z;
}

var layer_elements = [];
/**
 * Generates the map layer selector list
 * Includes adding the event listener to each element
 */

function generate_map_layer_list() {
  var ui = map_config.dom_layer;
  var html_content = "<h2 class>Map Layers</h2>";
  var keys = get_map_formal_names();
  keys.map(function (v, i) {
    console.log(v);
    html_content += "\n            <label id=\"l".concat(i, "\" class=\"layer-display ").concat(i == 0 ? "no-uncheck" : "", "\" for=\"li").concat(i, "\" data-layer=\"").concat(i, "\">\n                <input type=\"checkbox\" name=\"l").concat(i, "\" id=\"li").concat(i, "\" ").concat(i == 0 ? "checked" : "", ">\n                    Layer ").concat(i + 1, ": ").concat(v, "\n            </label>\n        ");
  });
  ui.innerHTML = html_content;
  layers.forEach(function (v, i) {
    var e = document.getElementById("l".concat(i));
    var cb = document.getElementById("li".concat(i));
    v.active = cb.checked;
    if (cb.checked) e.classList.add("active");
    e.addEventListener("click", map_layer_listener);
    layer_elements.push(e);
  });
}
/**
 * Shows or hides layers
 * Changes toggle checked value
 * Adds or removes active class
 * Changes layers active value
 * @param {Object} ev Event
 */


var map_layer_listener = function map_layer_listener(ev) {
  ev.preventDefault();
  var c = document.getElementById("li".concat(ev.target.dataset.layer));
  c.checked = !c.checked;
  ev.target.classList.toggle("active");
  layers[ev.target.dataset.layer].active = c.checked;
  display_layers();
};