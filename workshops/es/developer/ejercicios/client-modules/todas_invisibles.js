define([ "message-bus", "mibotonera" ], function(bus, b) {
	
	var ids = [];
	
	bus.listen("add-layer", function(event, layerInfo) {
		ids.push(layerInfo.id);
	});
	
	bus.listen("layers-loaded", function() {
		b.newButton("invisibles", function() {
			for (var i = 0; i < ids.length; i++) {
				bus.send("layer-visibility", [ids[i], false]);
			}
		});
	});

});