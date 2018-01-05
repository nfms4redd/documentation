define([ "message-bus" ], function(bus) {
	bus.listen("modules-loaded", function() {
		bus.send("add-group", [ {
			id : "0",
			name : "Límites administrativos"
		} ]);
		bus.send("add-layer", {
			"id" : "meteo-eeuu",
			"groupId" : "0",
			"label" : "Radar EEUU",
			"active" : "true",
			"timestamps": ["2011-03-01T00:00", "2011-03-02T00:00", "2011-03-03T00:00"],
			"wmsLayers" : [ {
				"baseUrl" : "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi",
				"wmsName" : "nexrad-n0r-wmst"
			} ]
		});
	});
});