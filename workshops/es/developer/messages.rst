Referencia mensajes
======================

.. _modules-loaded:

modules-loaded
-----------------------------

Enviado una vez el módulo ``customization`` ha cargado todos los módulos especificados por el servidor.

Parámetros: Ninguno.

Ejemplo de uso: Útil para realizar acciones que requieren que todos los módulos hayan sido cargados. Por ejemplo, el envío de mensajes de potencial interés para algún módulo ha de hacerse tras la carga de todos los módulos, es decir, una vez este mensaje ha sido enviado.

Más información:

* :ref:`bootstrap`



.. _before-adding-layers:

before-adding-layers
-----------------------------

Enviado justo antes de que se empiecen a lanzar los eventos add-group y add-layer. Da la oportunidad a otros módulos de realizar operaciones previas a la carga de las capas.

Parámetros: Ninguno.

Más información:

* :ref:`bootstrap`



.. _layers-loaded:

layers-loaded
-----------------------------

Enviado una vez el módulo ``layers`` ha lanzado los eventos ``add-layer`` y ``add-group`` correspondientes a la configuración de capas existente en el servidor.

Parámetros: Ninguno

Ejemplo de uso: Útil para realizar acciones que requieren que las capas de información se hayan cargado, por ejemplo, para centrar el mapa.

Más información:

* :ref:`bootstrap`
* :ref:`moduleconfiguration`



ajax
-----------------------------

Escuchado por el módulo communication para realizar llamadas a servicios.

Parámetros: Un objeto con las siguientes propiedades:

* url: URL a la que se quiere pedir la información
* success: función a ejecutar cuando el servidor responda satisfactoriamente
* complete: función a ejecutar cuando el servidor responda, sea satisfactoriamente o tras un error
* errorMsg: Mensaje de error
* error: función a ejecutar cuando el servidor responda con un error. Por defecto se generará un mensaje de error con el contenido de errorMsg.

Ejemplo de uso:



error
-----------------------------

Escuchado por el módulo ``error``, que muestra un mensaje de error al usuario:

Parametros: Mensaje con el error a mostrar

Ejemplo de uso::

	bus.send("error", "Dirección de e-mail incorrecta");



info-features
-----------------------------

Resultados de la petición de información a una única capa.

Parámetros:

* wmsLayerId: Id de la capa a la que pertenecen las features.
* features: array con las features OpenLayers. Cada feature tiene:

  * Una propiedad "aliases" que es un array que contiene un objeto con propiedades "name" y "alias" para cada atributo de la feature. Por ejemplo:
  
    .. code-block:: javascript
  
	[{
		"name" : "ident",
		"alias" : "Id"
	},
	{
		"name" : "nprov",
		"alias" : "Nombre"
	},
	{
		"name" : "pop96",
		"alias" : "Población (1996)"
	}]
  
  * Opcionalmente un atributo "bbox" con el bounding box de la geometría de la feature. Siempre en EPSG:900913.
  * Opcionalmente un atributo "geometry" que puede contener la geometría de la feature o el bounding box (en caso de que así se configure en el layers.json). Siempre en EPSG:900913.

* x: Posición X en la que se hizo click para obtener la información
* y: Posición Y en la que se hizo click para obtener la información

Ejemplo de uso:

Más información:



zoom-in
-----------------------------

Mueve la escala al nivel inmediatamente mayor

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("zoom-in");

Más información:



zoom-out
-----------------------------

Mueve la escala al nivel inmediatamente menor

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("zoom-out");

Más información:



zoom-to
-----------------------------

Mueve el encuadre al objeto OpenLayers.Bounds que se pasa como parámetro. El objeto bounds debe estar en el sistema de referencia del mapa (EPSG:900913)

Parámetros: OpenLayers.Bounds con el extent deseado

Ejemplo de uso::

	var bounds = new OpenLayers.Bounds();
	bounds.extend(new OpenLayers.LonLat(0,42));
	bounds.extend(new OpenLayers.LonLat(10,52));
	
	bounds.transform( new OpenLayers.Projection("EPSG:4326"),
		 new OpenLayers.Projection("EPSG:900913"));

	bus.send("zoom-to", bounds);

Más información:



initial-zoom
-----------------------------

Situa el mapa en la posición inicial

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("initial-zoom");

Más información:



set-default-exclusive-control
-----------------------------

Establece el control exclusivo por defecto para el mapa. Sólo un módulo exclusivo está activado en cada momento.

Parámetros: Objeto OpenLayers.Control.

Ejemplo de uso::

	var control = new OpenLayers.Control.WMSGetFeatureInfo({
	...
	});
	bus.send("set-default-exclusive-control", [control]);

Más información:



activate-default-exclusive-control
----------------------------------------------------------

Activar el control establecido por defecto mediante el mensaje ``set-default-exclusive-control``

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("activate-default-exclusive-control");

Más información:



activate-exclusive-control
-----------------------------

Pide la activación exclusiva del control que se pasa como parámetro y la desactivación del control exclusivo que estuviera activado en el momento de lanzar el mensaje 

Parámetros: OpenLayers.Control

Ejemplo de uso::

	var clickControl = new OpenLayers.Control({
	...
	});
	bus.send("activate-exclusive-control", [ clickControl ]);

Más información:



highlight-feature
-----------------------------

Indica que se debe resaltar la geometría que se pasa como parámetro

Parámetros: OpenLayers.Geometry

Ejemplo de uso:

Más información:



clear-highlighted-features
-----------------------------

Indica que se deben de eliminar todos los resaltes establecidos mediante ``highlight-feature``

Parámetros: Ninguno.

Ejemplo de uso:

Más información:



.. _add-group:

add-group
-----------------------------

Indica que se debe añadir un grupo al árbol de capas

Parámetros: Un objeto con las siguientes propiedades:

* id: identificador del grupo
* parentId: Opcional, para grupos dentro de otros grupos hace referencia al grupo contenedor
* name: nombre del grupo
* infoLink: Ruta de la página HTML con información sobre el grupo

Ejemplo de uso::

	bus.send("add-group", [ {
		id:"grupo_admin", 
		name:"Límites administrativos"
	}]);

Más información:



.. _add-layer:

add-layer
-----------------------------

Indica que se debe añadir una capa a la aplicación

Parámetros: Un objeto con las siguientes propiedades:

* id: id de la capa
* groupId: id del grupo en el que se debe añadir la capa
* label: Texto con el nombre de la capa a usar en el portal
* infoLink: Ruta de la página HTML con información sobre la capa
* inlineLegendUrl: URL con una imagen pequeña que situar al lado del nombre de la capa en el árbol de capas
* queryable: Si se pretende ofrecer herramienta de información para la capa o no
* active: Si la capa está inicialmente visible o no
* wmsLayers: Array con la información de las distintas capas WMS que se accederán desde esta capa. El caso más habitual es que se acceda sólo a una, pero es posible configurar varias. Los objetos de este array tienen la siguiente estructura:

  * baseUrl: URL del servidor WMS que sirve la capa
  * wmsName: Nombre de la capa en el servicio WMS
  * imageFormat: Formato de imagen a utilizar en las llamadas WMS
  * zIndex: Posición en la pila de dibujado
  * legend: Nombre del fichero imagen con la leyenda de la capa. Estos ficheros se acceden en static/loc/{lang}/images
  * label: Título de la leyenda
  * sourceLink: URL del proveedor de los datos
  * sourceLabel: Texto con el que presentar el enlace especificado en sourceLink
  * timestamps: Array con los instantes de tiempo en ISO8601 para los que la capa tiene información

Ejemplo de uso::

	bus.send("add-layer", {
		"id" : "meteo-eeuu",
		"groupId" : "landcover",
		"label" : "Radar EEUU",
		"active" : "true",
		"wmsLayers" : [ {
			"baseUrl" : "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi",
			"wmsName" : "nexrad-n0r-wmst"
		} ]
	});

Más información:



layer-visibility
-----------------------------

Cambia la visibilidad de una capa

Parámetros:

* id de la capa portal
* valor de visibilidad

Ejemplo de uso::

	bus.send("layer-visibility", ["provincias", false]);

Más información:


time-slider.selection
-----------------------------

Lanzado cuando el usuario selecciona un instante temporal global distinto al actual. Generalmente se actualiza el mapa con la información de esa fecha.

Parámetros: objeto Date con el instante temporal seleccionado

Ejemplo de uso::

	var d = new Date();
	bus.send("time-slider.selection", d);

Más información:


layer-time-slider.selection
-----------------------------

Lanzado cuando el usuario selecciona un instante temporal específico para una capa (a diferencia del ``time-slider.selection`` cuyo instante es global para todas las capas). 

Parámetros:

* id de la portalLayer que ha determinado su instante temporal.
* objeto Date con el instante temporal seleccionado

Ejemplo de uso::

	var d = new Date();
	bus.send("layer-time-slider.selection", ["mi-portal-layer", date]);

Más información:


layer-timestamp-selected
-----------------------------

Una capa ha escuchado uno de los eventos de selección temporal y ha determinado qué instancia temporal es la que más se ajusta a esa. La capa selecciona la última instancia temporal que es menor o igual al instante seleccionado o la primera instancia si el instante seleccionado es anterior a todas sus instancias.

Parámetros:

* id de la portalLayer que ha determinado su instante temporal.
* objeto Date con el instante temporal seleccionado

Más información:



toggle-legend
-----------------------------

Escuchado por el módulo ``legend-panel`` para mostrar u ocultar el panel con la leyenda.

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("toggle-legend");

Más información:

register-layer-action
-----------------------------

Escuchado por la lista de capas. Instala un botón a la derecha de las capas que realizará una acción al ser pulsado.

Parámetros: Función que devuelve el objeto jQuery que se mostará a modo de botón. Esta función toma como parámetro el mismo objeto que se lanza en el evento :ref:`add-layer`.  

Ejemplo de uso (botón de información)::

	bus.listen("before-adding-layers", function() {

		var showInfoAction = function(portalLayer) {
			if (portalLayer.hasOwnProperty("infoFile")) {
				aLink = $("<a/>").attr("href", portalLayer.infoFile);
				aLink.addClass("layer_info_button");
				aLink.fancybox({
					"closeBtn" : "true",
					"openEffect" : "elastic",
					"closeEffect" : "elastic",
					"type" : "iframe",
					"overlayOpacity" : 0.5
				});
				return aLink;
			} else {
				return null;
			}
		};

		bus.send("register-layer-action", showInfoAction);

	});

Más información:

register-group-action
-----------------------------

Igual que register-layer-action pero para grupos.

show-layer-panel
-----------------

Activa el panel de capas indicado.

Parámetros: identificador del panel a activar. La lista de paneles puede variar en función de los plugins que haya activados. La lista completa de ids es:

* all_layers_selector
* layers_transparency_selector
* layer_slider_selector (sólo con el plugin ``layer-time-sliders``)

Ejemplo de uso::

	bus.send("show-layer-panel", [ "layers_transparency_selector" ]);

Más información:
	

show-info
-----------------

Muestra una ventana emergente con determinada información que se pasa como parámetro.

Parámetros:

* title: Título de la ventana
* link: Bien una url que apunta a la página que se pretende mostrar, o un objeto jquery que será mostrado en la ventana  
* eventOptions: Opcional. Elemento con las opciones para la personalización de la ventana. Actualmente se utiliza FancyBox por lo que se puede añadir cualquier opción válida de este framework.

Ejemplo de uso::

	bus.send("show-info", [ "Mi info", "http://ambiente.gob.am/portal/static/loc/es/html/doc.html" ]);

Más información:


show-layer-info
-----------------

Muestra la información asociada a una capa con su atributo infoLink o infoFile.

Parámetros: identificador de la capa.

Ejemplo de uso::

	bus.send("show-layer-info", [ "provincias" ]);

show-group-info
-----------------

Muestra la información asociada a un grupo con su atributo infoLink o infoFile.

Parámetros: identificador del grupo

Ejemplo de uso::

	bus.send("show-group-info", [ "base" ]);
	
wait-mask
---------------

Muestra un indicador de que el sistema está ocupado y el usuario debe esperar

Parámetros: Texto informativo si se quiere activar o false si se quiere desactivar

Ejemplo de uso::

	bus.send("wait-mask", "Enviando información al servidor...");
	...
	bus.send("wait-mask", false);
