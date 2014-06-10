define([ "jquery", "message-bus", "botonera", "map", "jquery-ui" ], function($, bus, botonera, map) {

	var divTimeSliders = $("<div/>").attr("id", "layerTimeSliders");

	botonera.newButton("temporal", function() {
		divTimeSliders.dialog({
			closeOnEscape : true,
			width : "80%",
			resizable : true
		});
	});

	bus.listen("add-layer", function(event, layerInfo) {
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
			timestamps.sort(function(a, b) {
				return a - b;
			});

			$("<div/>").html(layerInfo.label).appendTo(divTimeSliders);
			var divTimeSlider = $("<div id='layer_time_slider_" + layerInfo.id + "'/>").appendTo(divTimeSliders);

			var divTimeSliderLabel = $("<div id='layer_time_slider_label_" + layerInfo.id + "'/>").appendTo(divTimeSliders);

			divTimeSlider.slider({
				change : function(event, ui) {
					var date = timestamps[ui.value];
					$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
						var layer = map.getLayer(wmsLayer.id);
						layer.mergeNewParams({
							'time' : date.toISO8601String()
						});
					});
				},
				slide : function(event, ui) {
					var date = timestamps[ui.value];
					divTimeSliderLabel.text(date);
				},
				max : timestamps.length - 1,
				value : timestamps.length - 1
			});

			divTimeSliderLabel.text(timestamps[timestamps.length - 1]);
		}

	});

});