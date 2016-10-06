define([ "message-bus" ], function(bus) {
	bus.listen("layers-loaded", function() {
		bus.send("open-legend", [ "argentina" ]);
	});
});