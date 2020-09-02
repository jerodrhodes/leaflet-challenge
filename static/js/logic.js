var myMap = L.map("map", {
    center: [0, -10.6731],
    zoom: 2
  });

// Define streetmap layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store earthquake API endpoint inside variable queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform GET request to the URL
d3.json(queryUrl, function(data) {
    // After response, send data.features object to createFatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define function we want to run for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p><b>Magnitude: </b>${feature.properties.mag}</p>`);
    }

    // Function to create circle based on earthquake  magnitude
    function radiusSize(magnitude) {
        return magnitude * 5;
    }

    // Function to set circle color based on magnitude
    function circleColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#993300";
            case magnitude > 4:
                return "#FF6600";
            case magnitude > 3:
                return "#FF9900";
            case magnitude > 2:
                return "#FFCC00";
            case magnitude > 1:
                return "#99CC00";
            default:
                return "#CCFFCC";
        }
    }

    // Create GeoJSON layer containing the features of the array on the earthquakeData object
    // Run onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            var magnitude = feature.properties.mag;
            return L.circleMarker(latlng, {
                color: "White",
                weight: 1,
                radius: radiusSize(magnitude),
                fillColor: circleColor(magnitude),
                fillOpacity: 1
            });
        },
        onEachFeature: onEachFeature
    }).addTo(myMap);

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = [0, 1, 2 , 3, 4, 5];
      var colors = ["#CCFFCC", "#99CC00", "#FFCC00", "#FF9900", "#FF6600", "#993300"];
      var labels = [];

      var legendData = "<h2>Earthquake Magnitude</h2>" + "<div class=\"labels\">" + "<div class=\"min\">" + limits[0] + "</div>" + "<div class=\"max\">" + limits[limits.length - 1] + "</div>" + "</div>";

      div.innerHTML = legendData;

      limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };
  legend.addTo(myMap);
};