define([ "message-bus" ], function(bus) {
	bus.listen("layers-loaded", function() {
		for (var i = 0; i < ids.length; i++) {
			bus.send("open-legend", [ "" ]);
		}
	});
});