//Los siguientes cambios sirven para crear una capa u otra en función de un atributo "type"
//del parámetro del evento "add-layer". Este parámetro se puede añadir 

//Esto se puede conseguir símplemente añadiendo el atributo en el layers.json, ya que 
//layers.js toma esa información para generar el evento

//Contenido a reemplazar

var layer = new OpenLayers.Layer.WMS(wmsLayer.id, wmsLayer.baseUrl, {
	layers : wmsLayer.wmsName,
	buffer : 0,
	transitionEffect : "resize",
	removeBackBufferDelay : 0,
	isBaseLayer : false,
	transparent : true,
	format : wmsLayer.imageFormat || 'image/png'
}, {
	noMagic : true
});

// Nuevo código

var layer;
if (wmsLayer.type == "osm") {
	layer = new OpenLayers.Layer.OSM(wmsLayer.id, wmsLayer.osmUrls);
} else if (wmsLayer.type == "wfs") {
	layer = new OpenLayers.Layer.Vector("WFS", {
		strategies : [ new OpenLayers.Strategy.Fixed() ],
		protocol : new OpenLayers.Protocol.WFS({
			version : "1.0.0",
			url : wmsLayer.baseUrl,
			featureType : wmsLayer.featureTypeName
		}),
		projection : new OpenLayers.Projection("EPSG:4326")
	});
} else {
	layer = new OpenLayers.Layer.WMS(wmsLayer.id, wmsLayer.baseUrl, {
		layers : wmsLayer.wmsName,
		buffer : 0,
		transitionEffect : "resize",
		removeBackBufferDelay : 0,
		isBaseLayer : false,
		transparent : true,
		format : wmsLayer.imageFormat || 'image/png'
	}, {
		noMagic : true
	});
}

//Este código permite la carga de capas OSM estableciendo en el JSON este contenido en la propiedad wmsLayers::

//	{
//  "id" : "cycle-osm",
//  "type" : "osm",
//  "osmUrls" : [
//          "http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
//          "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
//          "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"
//  ]
//}

//Se recomienda documentar y acordar los cambios en layers.json con el resto de
//desarrolladores
