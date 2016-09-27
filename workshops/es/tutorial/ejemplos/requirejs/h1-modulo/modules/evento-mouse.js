define([ "jquery", "h1-modulo" ], function($) {
	$("#titulo").on("mouseover", function() {
		$("#titulo").css("color", "red");
		$("<div>")//
		.attr("id", "texto")//
		.html("Hemos pintado el título de rojo")//
		.appendTo("body");
	});
	$("#titulo").on("mouseout", function() {
		$("#titulo").css("color", "black");
		$("#texto").remove();
	});
});