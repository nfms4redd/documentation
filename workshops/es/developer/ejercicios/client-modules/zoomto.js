define([ "layout", "map" ], function(layout, map) {
	var txtLat = $("<input/>").attr("id", "txtLat").attr("type", "text").appendTo(layout.toolbar);
	var txtLon = $("<input/>").attr("id", "txtLon").attr("type", "text").appendTo(layout.toolbar);
	$("<button/>").html("ir!").appendTo(layout.toolbar).click(function() {
		var newCenter = new OpenLayers.LonLat(txtLon.val(), txtLat.val());
		newCenter.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
		map.setCenter(newCenter, 10);
	});
});