define([ "message-bus", "map", "botonera", "openlayers" ], //
function(bus, map, botonera) {

	var clickControl = new OpenLayers.Control();
	clickControl.handler = new OpenLayers.Handler.Click(clickControl, {
		'click' : function(e) {
			var lonlat = map.getLonLatFromPixel(e.xy);
			lonlat.transform(map.projection, new OpenLayers.Projection("EPSG:4326"));
			bus.send("ajax", {
				dataType : "text",
				url : "weather?lat=" + lonlat.lat + "&lon=" + lonlat.lon,
				success : function(data, textStatus, jqXHR) {
					if (data.hasOwnProperty("message")) {
						window.alert(data.message);
					} else {
						window.alert("Temperatura en: " + data.name + //
						": " + (data.main.temp - 273.15));
					}
				}
			});
		}
	});

	botonera.newButton("temperatura", function() {
		bus.send("activate-exclusive-control", clickControl);
	});
});
