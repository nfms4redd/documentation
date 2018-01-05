define([ "jquery", "traducciones" ], function($, traducciones) {
	$("<h1>")//
	.attr("id", "titulo")//
	.html(traducciones["hola"])//
	.appendTo("body");
	// <h1 id="titulo">Hola mundo</h1>
});