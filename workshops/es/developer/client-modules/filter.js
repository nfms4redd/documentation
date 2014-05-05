define([ "message-bus", "botonera", "map" ], function(bus, botonera, map) {
	botonera.newText(function(text) {
		var provincesLayer = map.getLayer("provinces");
		provincesLayer.mergeNewParams({
			"CQL_FILTER" : text
		});
	});
	
	// http://lin-ear-th-inking.blogspot.de/2013/06/how-to-get-openlayers-wmsgetfeatureinfo.html
});