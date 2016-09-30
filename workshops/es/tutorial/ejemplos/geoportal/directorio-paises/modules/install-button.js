define([ "toolbar" ], function(toolbar) {
	var button = $("<a/>")//
	.addClass("blue_button")//
	.addClass("toolbar_button")//
	.html("Directorio países")//
	.on("click", function(){
	});
	toolbar.append(button);
});