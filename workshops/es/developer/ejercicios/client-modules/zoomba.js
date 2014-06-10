define([ "botonera", "message-bus" ], function(botonera, bus) {
	botonera.newButton("zoom to Bs As", function(){
		
		var bounds = new OpenLayers.Bounds();
		bounds.extend(new OpenLayers.LonLat(-57,-33));
		bounds.extend(new OpenLayers.LonLat(-59,-35));
		
		bounds.transform( new OpenLayers.Projection("EPSG:4326"),
				 new OpenLayers.Projection("EPSG:900913"));
		
		bus.send("zoom-to", bounds);
	});
});