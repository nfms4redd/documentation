//Para hacer funcionar este ejercicio es necesario que se puedan cargar capas vector en el 
//mapa. Ver modificaciones-map.js, que permite cargar capas especificadas en el layers.json
//de esta manera:

//		{
//			"id" : "wfs_barcos",
//			"type" : "wfs",
//			"baseUrl" : "http://192.168.25.179/geoserver/wfs",
//			"featureTypeName" : "curso_ecuador:barcos"
//		},
		
define(["map"], function(map) {
	setInterval(function() {
		var layer = map.getLayer("wfs_barcos");
		layer.refresh();
	}, 1000);
});
