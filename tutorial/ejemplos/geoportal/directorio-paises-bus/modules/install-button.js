define([ "toolbar", "./zoom-panel" ], function(toolbar, zoomPanel) {
	var button = $("<a/>")//
	.appendTo(toolbar)//
	.addClass("blue_button")//
	.addClass("toolbar_button")//
	.html("Directorio países")//
	.on("click", function() {
		zoomPanel()
	});
});