define([ "map", "layout" ], function(map, layout) {

	var divMap = layout["map"];
	var divCoor = $("<div/>").attr("id", "coor");
	divMap.append(divCoor);
	var control = new OpenLayers.Control.MousePosition({
		prefix : '<a target="_blank" ' + 'href="http://spatialreference.org/ref/epsg/4326/">' + 'EPSG:4326</a> coordinates: ',
		div : divCoor.get(0),
		separator : ' | ',
		numDigits : 2,
		emptyString : 'Mouse is not over map.'
	});
	map.addControl(control);

});