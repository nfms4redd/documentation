Añadir una botonera
===================

Este manual pretende añadir un botón al portal creando un módulo botonera que facilite la tarea en lo sucesivo.

Así pues, el proceso será similar, con la diferencia que en lugar de añadir un botón, vamos a añadir un objeto div::

	define([ "jquery", "layout" ], function($, layout) {
		var botonera = $("<div/>").attr("style", "position:absolute;top:6px; left:7em; z-index:2000");
		botonera.appendTo(layout["map"]);

	});
	
En el código anterior podemos observar cómo se crea un objeto ``div``, se estila y se añade al espacio reservado para el mapa por el módulo ``layout``. Esto último quiere decir que la botonera estará sobre el mapa.

A continuación debemos de dar la posibilidad a otros módulos para que añadan elementos a dicha botonera. Existen dos maneras: escuchando un mensaje o devolviendo un objeto con un método que añada el botón cuando es invocado. En este manual veremos esta última posibilidad.

Para ello el módulo deberá devolver un objeto ``{}`` con una propiedad que sea una función::

 	define([ "jquery", "layout" ], function($, layout) {
		var botonera = $("<div/>").attr("style", "position:absolute;top:6px; left:8em; z-index:2000");
		botonera.appendTo(layout["map"]);
	  	return {
			newButton : function(text, callback) {
				// Añade el botón
			}
		};
	});

Para utilizar esta funcionalidad, es necesario crear un nuevo módulo que importe el módulo ``botonera``::

	define([ "botonera" ], function(botonera) {
	
	});

En este código, la variable ``botonera`` recibida en la función de inicialización del módulo es el valor de retorno de la inicialización del módulo ``botonera``, por lo que es posible hacer llamadas a la propiedad ``newButton`` de esta variable::

	define([ "botonera" ], function(botonera) {
		botonera.newButton("hola mundo", function() {
			alert('hola mundo');
		});
	});

Por último, queda implementar el código de la función ``newButton``, que debe tomar al menos un texto y una función ``callback`` que se invocará cuando se pinche en el botón::

 	define([ "jquery", "layout" ], function($, layout) {
		var botonera = $("<div/>").attr("style", "position:absolute;top:6px; left:7em; z-index:2000");
		botonera.appendTo(layout["map"]);
	  	return {
			newButton : function(text, callback) {
				var aButton = $("<button/>").html(text);
				aButton.appendTo(botonera);
				aButton.click(callback);
			}
		};
	});
 