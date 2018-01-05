define([ "botonera", "dibujado", "message-bus" ], function(botonera, dibujado, bus) {

	botonera.newButton("guardar", function() {
		var features = dibujado.markers().features;
		var format = new OpenLayers.Format.GeoJSON();
		var geojsonString = format.write(features);
		bus.send("ajax", {
			type : "POST",
			data : geojsonString,
			contentType : 'application/json',
			url : "saveMarkers",
			success : function(data, textStatus, jqXHR) {
				window.alert("Datos enviados con éxito");
			}

		});
	});
});