Posición del mapa
===================

Cada vez que se quiere añadir un mapa OpenLayers en una página web se comienza escribiendo código en el que creamos el mapa::

	var map = new OpenLayers.Map("map", {
		theme : null,
		projection : new OpenLayers.Projection("EPSG:4326"),
		units : "m",
		allOverlays : true,
		controls : []
	});

para luego interactuar con él añadiéndole capas, instalando controles, etc.::

	map.addControl(new OpenLayers.Control.Navigation({
		documentDrag : true,
		zoomWheelEnabled : true
	}));
	map.addControl(new OpenLayers.Control.MousePosition({
		prefix : '<a target="_blank" ' +
                        'href="http://spatialreference.org/ref/epsg/4326/">' + 'EPSG:4326</a> coordinates: ',
		separator : ' | ',
		numDigits : 2,
		emptyString : 'Mouse is not over map.'
	}));

Sin embargo, en el portal de diseminación ya existe un mapa creado. ¿Cuál es la manera de proceder para obtener una referencia a dicho mapa y, por ejemplo, mostrar información sobre las coordenadas que se están navegando?

La respuesta es sencilla, símplemente hay que importar el módulo ``map`` y obtener la referencia en la función de inicialización::

	define([ "map", "layout" ], function(map, layout) {
	
		var divMap = layout["map"];
		var divCoor = $("<div/>").attr("id", "coor");
		divMap.append(divCoor);
		var control = new OpenLayers.Control.MousePosition({
			prefix : '<a target="_blank" ' + 'href="http://spatialreference.org/ref/epsg/4326/">' + 'EPSG:4326</a> coordinates: ',
			div : divCoor.get(0),
			separator : ' | ',
			numDigits : 2,
			emptyString : 'Mouse is not over map.'
		});
		map.addControl(control);
	
	});