define([ "botonera", "message-bus" ], function(botonera, bus) {

	var layerIds = [];

	bus.listen("add-layer", function(e, layerInfo) {
		console.log(layerInfo);
		layerIds.push(layerInfo.id);
	});

	botonera.newButton("bluemarbleoff", function() {
		for (var i = 0; i < layerIds.length; i++) {
			bus.send("layer-visibility", [ layerIds[i], false ]);
		}
	});
});