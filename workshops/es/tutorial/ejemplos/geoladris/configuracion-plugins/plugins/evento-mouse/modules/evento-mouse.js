define([ "jquery", "i18n", "h1-modulo" ], function($, i18n) {
	$("<div>")//
	.attr("id", "texto")//
	.html(i18n["comentario"])//
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