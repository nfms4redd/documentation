define([ "jquery", "traducciones", "h1-modulo" ], function($, traducciones) {
	$("<div>")//
	.attr("id", "texto")//
	.html(traducciones["comentario"])//
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