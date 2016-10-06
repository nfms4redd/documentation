define([ "message-bus" ], function(bus) {

	function showZoomPanel() {
		if ($("#paises").length > 0) {
			$("#paises").remove();
		} else {
			$("<div/>")//
			.appendTo("body")//
			.attr("id", "paises")//
			.attr("class", "panel-paises");

			var paises = {
				"Argentina" : [ -62, -38 ],
				"Bolivia" : [ -65, -19 ],
				"Ecuador" : [ -78, 0 ],
				"Paraguay" : [ -57, -25 ]
			};

			for ( var pais in paises) {
				var button = $("<button/>")//
				.appendTo("#paises")//
				.attr("id", pais)//
				.html(pais)//
				.on("click", function(e) {
					var pais = $(e.target).attr("id");
					bus.send("zoom-to", {
						"x" : paises[pais][0],
						"y" : paises[pais][1],
						"zoomLevel" : 4
					});
				});
			}
		}
	}
	return showZoomPanel
});