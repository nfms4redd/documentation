define([ "jquery", "h1-modulo" ], function($) {
	$("<div>")//
	.attr("id", "texto")//
	.html("Hemos pintado el título de rojo")//
	.addClass("activable")//
	.appendTo("body");
	$("#titulo").addClass("activable");

	$("#titulo").on("mouseover", function() {
		$("#titulo").addClass("activo");
		$("#texto").addClass("activo");
	});
	$("#titulo").on("mouseout", function() {
		$("#titulo").removeClass("activo");
		$("#texto").removeClass("activo");
	});
});