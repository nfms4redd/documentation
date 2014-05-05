define([ "map", "jquery", "openlayers" ], function(map, $) {

	var mapCRS = new OpenLayers.Projection("EPSG:900913");
	var epsg4326 = new OpenLayers.Projection("EPSG:4326");

	var divInfo = $("<div/>").attr("id", "info").appendTo("body");
	divInfo.attr("style", "position:absolute;bottom:0px;right:10em;" + //
	"z-index:1000;background-color: #3388CC;color: white;" + //
	"width:10em;text-align:center");

	hoverControl = new OpenLayers.Control();
	hoverControl.handler = new OpenLayers.Handler.Hover(hoverControl, {
		'pause' : function(e) {
			var lonlat = map.getLonLatFromPixel(e.xy);
			lonlat.transform(mapCRS, epsg4326);
			var requestData = {
				url : "http://v2.suite.opengeo.org/geoserver/ows?" + //
				"request=GetFeature&service=WFS&VERSION=1.0.0&" + //
				"TypeName=usa:states&propertyName=usa:STATE_NAME&" + //
				"srsName=EPSG:4326&bbox=" + (lonlat.lon - 0.1) + "," + //
				(lonlat.lat - 0.1) + "," + (lonlat.lon + 0.1) + "," + //
				(lonlat.lat + 0.1) + "&MAXFEATURES=1"
			};
			$.ajax({
				dataType : "text",
				url : "proxy",
				data : $.param(requestData),
				success : function(data, textStatus, jqXHR) {
					if (data.hasOwnProperty("message")) {
						window.alert(data.message);
					} else {
						var features = new OpenLayers.Format.GML().read(data);
						if (features.length && features.length > 0) {
							var stateName = features[0].data["STATE_NAME"];
							divInfo.html(stateName);
						}
					}
				},
				error : function() {
					window.alert("Cannot get name");
				}
			});
		}
	}, {
		'delay' : 100,
		'pixelTolerance' : 30
	});

	map.addControl(hoverControl);
	hoverControl.activate();
});