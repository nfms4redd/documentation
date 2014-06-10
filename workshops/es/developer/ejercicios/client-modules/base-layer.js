//Para hacer funcionar este ejercicio es necesario que el mensaje "add-layer" incorpore
//en el parámetro con la información de la capa un atributo "baseLayer", con valor verdadero
//si la capa debe ser considerada exclusiva.

//Esto se puede conseguir símplemente añadiendo el atributo en el layers.json, ya que 
//layers.js toma esa información para generar el evento. Por ejemplo:

//		{
//			"id" : "blue-marble",
//			"active" : true,
//			"label" : "Blue marble",
//			"baseLayer" : true,
//			"layers" : [ "blue-marble" ]
//		},
		
// Se recomienda documentar y acordar los cambios en layers.json con el resto de
// desarrolladores
define([ "message-bus", "jquery" ], function(bus, $) {

	var ids = [];

	bus.listen("add-layer", function(e, layerInfo) {
		if (layerInfo.baseLayer) {
			ids.push(layerInfo.id);
		}
	});

	bus.listen("layer-visibility", function(e, layerId, visibility) {
		if (visibility == true) {
			if ($.inArray(layerId, ids) != -1) {
				for (var i = 0; i < ids.length; i++) {
					if (ids[i] != layerId) {
						bus.send("layer-visibility", [ ids[i], false ]);
					}
				}
			}
		}
	});
});