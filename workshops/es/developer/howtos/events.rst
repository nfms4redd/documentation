Manejo de eventos
===================

El siguiente tutorial muestra cómo a través de los eventos existentes es posible interactuar con la plataforma. Para ello crearemos un módulo consistente en poner a invisible todas las capas (checkbox desactivado) mediante dos pasos típicos:

1. Captura de eventos y recogida de información
-------------------------------------------------

Para poner invisible las capas se utilizará el evento "layer-visibility", al que se pasa el identificador de la capa y el valor de visibilidad. El valor de visibilidad es siempre falso, pero además se necesitará la lista de identificadores de todas las capas. Es en este punto es necesario escuchar el evento "add-layer" y guardar la información relevante, los identificadores de las capas::

	define([ "message-bus" ], function(bus) {
	
		var layerIds = [];
	
		bus.listen("add-layer", function(event, layerInfo) {
			layerIds.push(layerInfo.id);
		});
	});

2. Ejecución del módulo
--------------------------

Una vez recopilados todos los ids, sólo queda lanzar el mensaje para cada una de las capas. Esto se hará en respuesta a la pulsación en un botón, utilizando el módulo ``botonera`` creado en manuales anteriores::

	define([ "message-bus", "botonera" ], function(bus, botonera) {
	
		var layerIds = [];
	
		bus.listen("add-layer", function(event, layerInfo) {
			layerIds.push(layerInfo.id);
		});
	
		botonera.newButton("todas invisibles", function() {
			for (var i = 0; i < layerIds.length; i++) {
				bus.send("layer-visibility", [layerIds[i], false]);
			}
		});
	});

Patrón habitual
----------------

El presente manual es un ejemplo sencillo de un patrón que se repite una y otra vez a lo largo del portal:

1.- Escuchado de eventos y recogida de información
2.- Realización de una acción con la información obtenida de los eventos