define([ "botonera", "message-bus", "map", "jquery-ui"], function(botonera, bus, map) {

	var dlg = $("<div/>");

	bus.listen("add-layer", function(e, layerInfo) {
		var timestamps = [];
		$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
			if (wmsLayer.hasOwnProperty("timestamps")) {
				for (var i = 0; i < wmsLayer.timestamps.length; i++) {
					var d = new Date();
					d.setISO8601(wmsLayer.timestamps[i]);
					timestamps.push(d);
				}
			}
		});

		if (timestamps.length > 0) {
			$("<div/>").html(layerInfo.label).appendTo(dlg);
			
			var miSlider = $("<div/>").appendTo(dlg);
			miSlider.slider({
				change : function(event, ui) {
					var date = timestamps[ui.value];
//					bus.send("layer-time-change", {
//						layerId : layerInfo.id,
//						date: date
//					});
					$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
						var layer = map.getLayer(wmsLayer.id);
						layer.mergeNewParams({
							'time' : date.toISO8601String()
						});
					});
				},
				slide : function(event, ui) {
				},
				max : timestamps.length - 1,
				value : timestamps.length - 1
			});
		}
	});

	botonera.newButton("sliders", function() {
		dlg.dialog();
	});
});