define(["map"], function(map) {
	map.addControl(new OpenLayers.Control.MousePosition({
		prefix : '<a target="_blank" ' + 'href="http://spatialreference.org/ref/epsg/4326/">' + 'EPSG:4326</a> coordinates: ',
		separator : ' | ',
		numDigits : 2,
		emptyString : 'Mouse is not over map.'
	}));

});