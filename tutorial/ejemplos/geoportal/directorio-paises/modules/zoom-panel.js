define([ "map" ], function(map) {

	function showZoomPanel() {
		if ($("#paises").length > 0) {
			$("#paises").remove();
		} else {
			$("<div/>")//
			.appendTo("body")//
			.attr("id", "paises")//
			.attr("class", "panel-paises");

			var paises = {
				"Argentina" : "-62, -38",
				"Bolivia" : "-65, -19",
				"Ecuador" : "-78, 0",
				"Paraguay" : "-57, -25"
			};

			for ( var pais in paises) {
				var button = $("<button/>")//
				.appendTo("#paises")//
				.attr("id", pais)//
				.html(pais)//
				.on("click", function(e) {
					var pais = $(e.target).attr("id");
					var center = new OpenLayers.LonLat(paises[pais].split(","));
					var epsg4326 = new OpenLayers.Projection("EPSG:4326");
					center.transform(epsg4326, map.projection);
					map.setCenter(center);
				});
			}
		}
	}
	return showZoomPanel
});