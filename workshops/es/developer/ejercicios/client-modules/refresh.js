define(["map"], function(map) {
	setInterval(function() {
		var layer = map.getLayer("wms_barcos");
		layer.redraw(true);
	}, 1000);
});