Mensajes relevantes
======================

.. _modules-loaded:

**modules-loaded**

Enviado una vez el módulo ``customization`` ha cargado todos los módulos especificados por el servidor.

Parámetros: Ninguno.

Ejemplo de uso: Útil para realizar acciones que requieren que todos los módulos hayan sido cargados. Por ejemplo, el envío de mensajes de potencial interés para algún módulo ha de hacerse tras la carga de todos los módulos, es decir, una vez este mensaje ha sido enviado.

Más información:

* :ref:`bootstrap`



.. _layers-loaded:

**layers-loaded**

Enviado una vez el módulo ``layers`` ha lanzado los eventos ``add-layer`` y ``add-group`` correspondientes a la configuración de capas existente en el servidor.

Parámetros: Ninguno

Ejemplo de uso: Útil para realizar acciones que requieren que las capas de información se hayan cargado, por ejemplo, para centrar el mapa.

Más información:

* :ref:`bootstrap`
* :ref:`moduleconfiguration`



**ajax**

Escuchado por el módulo communication para realizar llamadas a servicios.

Parámetros: Un objeto con las siguientes propiedades:

* url: URL a la que se quiere pedir la información
* success: función a ejecutar cuando el servidor responda satisfactoriamente
* complete: función a ejecutar cuando el servidor responda, sea satisfactoriamente o tras un error
* errorMsg: Mensaje de error
* error: función a ejecutar cuando el servidor responda con un error. Por defecto se generará un mensaje de error con el contenido de errorMsg.

Ejemplo de uso:



**error**

Escuchado por el módulo ``error``, que muestra un mensaje de error al usuario:

Parametros: Mensaje con el error a mostrar

Ejemplo de uso::

	bus.send("error", "Dirección de e-mail incorrecta");



**info-features**

Parámetros:

* features: array con las features OpenLayers
* x: Posición X en la que se hizo click para obtener la información
* y: Posición Y en la que se hizo click para obtener la información

Ejemplo de uso:

Más información:



**zoom-in**

Mueve la escala al nivel inmediatamente mayor

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("zoom-in");

Más información:



**zoom-out**

Mueve la escala al nivel inmediatamente menor

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("zoom-out");

Más información:



**zoom-to**

Mueve el encuadre al objeto OpenLayers.Bounds que se pasa como parámetro

Parámetros: OpenLayers.Bounds con el extent deseado

Ejemplo de uso::

	var bounds = new OpenLayers.Bounds();
	bounds.extend(new OpenLayers.LonLat(0,42));
	bounds.extend(new OpenLayers.LonLat(10,52));
	bus.send("zoom-to", bounds);

Más información:



**initial-zoom**

Situa el mapa en la posición inicial

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("initial-zoom");

Más información:



**set-default-exclusive-control**

Establece el control exclusivo por defecto para el mapa. Sólo un módulo exclusivo está activado en cada momento.

Parámetros: Objeto OpenLayers.Control.

Ejemplo de uso::

	var control = new OpenLayers.Control.WMSGetFeatureInfo({
	...
	});
	bus.send("set-default-exclusive-control", [control]);

Más información:



**activate-default-exclusive-control**

Activar el control establecido por defecto mediante el mensaje ``set-default-exclusive-control``

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("activate-default-exclusive-control");

Más información:



**activate-exclusive-control**

Pide la activación exclusiva del control que se pasa como parámetro y la desactivación del control exclusivo que estuviera activado en el momento de lanzar el mensaje 

Parámetros: OpenLayers.Control

Ejemplo de uso::

	var clickControl = new OpenLayers.Control({
	...
	});
	bus.send("activate-exclusive-control", [ clickControl ]);

Más información:



**highlight-feature**

Indica que se debe resaltar la feature que se pasa como parámetro

Parámetros: OpenLayers.Feature

Ejemplo de uso:

Más información:



**clear-highlighted-features**

Indica que se deben de eliminar todos los resaltes establecidos mediante ``highlight-feature``

Parámetros: Ninguno.

Ejemplo de uso:

Más información:



.. _add-group:

**add-group**

Indica que se debe añadir un grupo al árbol de capas

Parámetros: Un objeto con las siguientes propiedades:

* id: identificador del grupo
* parentId: Opcional, para grupos dentro de otros grupos hace referencia al grupo contenedor
* name: nombre del grupo
* infoFile: Ruta de la página HTML con información sobre el grupo

Ejemplo de uso::

	bus.send("add-group", [ {
		id:0, 
		name:"Límites administrativos"
	}]);

Más información:



.. _add-layer:

**add-layer**

Indica que se debe añadir una capa a la aplicación

Parámetros: Un objeto con las siguientes propiedades:

* id: id de la capa
* groupId: id del grupo en el que se debe añadir la capa
* label: Texto con el nombre de la capa a usar en el portal
* infoFile: Nombre del fichero HTML con información sobre la capa. El fichero se accede en static/loc/{lang}/html
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



**layer-visibility**

Cambia la visibilidad de una capa

Parámetros:

* id de la capa portal
* valor de visibilidad

Ejemplo de uso::

	bus.send("layer-visibility", ["provincias", false]);

Más información:



**maplayer-added**

Lanzado cuando el mapa ha añadido una capa

Parámetros:

* Objeto OpenLayers.Layer.WMS con la capa que se ha añadido
* Objeto con la información del evento ``add-layer`` que originó la creación de la capa

Ejemplo de uso:

Más información:



**time-slider.selection**

Lanzado cuando el usuario selecciona un instante temporal distinto al actual. Generalmente se actualiza el mapa con la información de esa fecha.

Parámetros: objeto Date con el instante temporal seleccionado

Ejemplo de uso::

	var d = new Date();
	bus.send("time-slider.selection", d);

Más información:



**toggle-legend**

Escuchado por el módulo ``legend-panel`` para mostrar u ocultar el panel con la leyenda.

Parámetros: Ninguno

Ejemplo de uso::

	bus.send("toggle-legend");

Más información:



**evento**

Parámetros:

Ejemplo de uso:

Más información:


