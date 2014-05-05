define([ "botonera", "map", "message-bus" ], function(botonera, map, bus) {

	var layer;
	var polygonLayer;

	bus.listen("layers-loaded", function() {
		var customStyle = new OpenLayers.StyleMap({
			"default" : new OpenLayers.Style({
				pointRadius : "22",
				externalGraphic : "http://www.clker.com/cliparts/M/K/y/j/r/N/marker-md.png"
			})
		});

		// Create a vector layer and give it your style map.
		layer = new OpenLayers.Layer.Vector("Points", {
			styleMap : customStyle
		});
		polygonLayer = new OpenLayers.Layer.Vector();

		var marcas = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Point, {
			displayClass : "olControlDrawFeaturePoint",
			title : "Draw Features"
		});
		var poligonos = new OpenLayers.Control.DrawFeature(polygonLayer, OpenLayers.Handler.Polygon, {
			displayClass : "olControlDrawFeaturePoint",
			title : "Draw Features"
		});

		map.addLayer(layer);
		map.addLayer(polygonLayer);
		botonera.newButton("marcas", function() {
			bus.send("activate-exclusive-control", marcas);
		});
		botonera.newButton("poligonos", function() {
			bus.send("activate-exclusive-control", poligonos);
		});
		botonera.newButton("info", function() {
			bus.send("activate-default-exclusive-control");
		});
	});

	return {
		markers : function() {
			return layer;
		},
		polygons : function() {
			return polygonLayer;
		}
	};
});