define([ "message-bus", "botonera" ], function(bus, botonera) {

	var layerIds = [];

	bus.listen("add-layer", function(event, layerInfo) {
		layerIds.push(layerInfo.id);
	});

	botonera.newButton("todas invisibles", function() {
		for (var i = 0; i < layerIds.length; i++) {
			bus.send("layer-visibility", [layerIds[i], false]);
		}
	});
});
