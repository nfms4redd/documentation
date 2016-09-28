define([ "jquery" ], function($) {
	$("<h1>")//
	.attr("id", "titulo")//
	.html("Hola mundo")//
	.appendTo("body");
	// <h1 id="titulo">Hola mundo</h1>
});