define([ "jquery", "i18n" ], function($, i18n) {
	$("<h1>")//
	.attr("id", "titulo")//
	.html(i18n["hola"])//
	.appendTo("body");
	// <h1 id="titulo">Hola mundo</h1>
});