define([ "message-bus", "botonera", "map" ], function(bus, botonera, map) {

	botonera.newButton("guardar centro", function() {
		var center = map.getCenter();
		center.transform(new OpenLayers.Projection("EPSG:900913"),
				new OpenLayers.Projection("EPSG:4326"));
		var zoomLevel = map.getZoom();
		bus.send("ajax", {
			url : "guardacentro?lon=" + center.lon + //
				"&lat=" + center.lat + "&zoomLevel=" + zoomLevel,
			success : function(indicators, textStatus, jqXHR) {
				alert("centro guardado");
			},
			errorMsg : "No se pudo guardar el centro"
		});
	});
});
