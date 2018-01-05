define([ "botonera", "map", "message-bus" ], function(botonera, map, bus) {

	var control = new OpenLayers.Control.Measure(OpenLayers.Handler.Path);
	control.events.on({
		"measure" : function(evt) {
			alert(evt.measure + " " + evt.units);
		}
	});

	botonera.newButton("medir", function() {
		bus.send("activate-exclusive-control", control);
	});
});
