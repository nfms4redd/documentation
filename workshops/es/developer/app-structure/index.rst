Estructura de la aplicación
============================

El portal es una aplicación JEE (Java Enterprise Edition). Utiliza Maven como herramienta de compilación, adaptándose a la estructura por defecto que por convención tienen los proyectos Maven:

- src/main/java: Código fuente Java
- src/main/resources: Recursos usados por el código Java
- src/test/java y src/test/resources: Tests automatizados
- src/main/webapp: Raíz de la aplicación web
- pom.xml: Descriptor del proyecto Maven.

La aplicación tiene una arquitectura cliente servidor, en la que la parte cliente, en Javascript, se comunica mediante llamadas AJAX con los servicios web implementados en Java.

Cliente Javascript
-------------------

El cliente Javascript es una aplicación modular basada en RequireJS que se comunica medainte llamadas AJAX con los servicios web.

Dentro de ``src/main/webapp`` podemos encontrar:

* js: Librerías Javascript utilizadas por la aplicación: OpenLayers, requireJS, etc.
* styles: estilos CSS generales
* modules: Módulos requirejs y estilos de cada módulo


Servicios Java
---------------

Los servicios Java consisten en una serie de *Servlets*, *Filters* y *ApplicationContexts* definidos en el fichero ``WEB-INF/web.xml`` del espacio web, es decir en ``src/main/webapp/WEB-INF/web.xml``.

En la especificación j2EE, el directorio ``WEB-INF`` debe estar en la raíz de la aplicación (``src/main/webapp/``) pero su contenido no es accesible a través del contenedor de aplicaciones (Tomcat).

Dentro de ``WEB-INF`` podemos ver además un directorio ``default_config``, que es una copia inicial del directorio de configuración utilizado por la aplicación. En él podemos encontrar:

* indicators: Datos para la presentación de gráficas (experimental)
* messages: Ficheros .properties con las traducciones para las distintas cadenas utilizadas en la aplicación
* modules: Módulos particulares de la instalación. Equivalente al ``modules`` de ``src/main/webapp/`` pero con mayor prioridad en caso de que haya dos módulos con el mismo nombre. Una vez la aplicación se despliega en Tomcat es muy importante no realizar modificaciones en los directorios de la aplicación ya que cada vez que se despliegue una nueva versión todas las modificaciones son borradas. Así, en lugar de realizar modificaciones a los módulos en ``src/main/webapp/`` es conveniente hacerlo en este directorio ``modules``, que estará ubicado en ``/var/portal/`` y no es afectado por nuevos despliegues de la aplicación.
* static: Contenidos estáticos
* static/overrides.css: última hoja CSS cargada, ideal para sobreescribir otros estilos
* static/loc: Recursos clasificados por idioma
* layers.json: Configuración de las capas.
* portal.properties: Propiedades generales del sistema

portal.properties
.................

* languages = {"en": "English", "fr": "Fran\u00e7ais", "es": "Espa\u00f1ol"}

  Elemento JSON con los idiomas que soporta la aplicación
  
* languages.default = en

  Idioma por defecto.
  
* layers.rootFolder=/tmp

  Raíz de la configuración de estadísticas (experimental)
  
* info.layerUrl=http://demo1.geo-solutions.it/diss_geoserver/gwc/service/wms

  URL de las capas ``queryable``

* info.queryUrl=http://demo1.geo-solutions.it/diss_geoserver/wms
  
  URL de las capas ``queryable`` contra la que hacer la petición GetFeatureInfo
  
* client.modules=wfs-query,mouse-position,measure,layer-tree,layers,communication,iso8601,error-management,map,banner,toolbar,time-slider,layer-list,info-control,info-dialog,center,zoom-bar,layer-list-selector,active-layer-list,legend-button,legend-panel

  Lista de módulos a cargar en la aplicación
  
* map.centerLonLat=24, -4

  Longitud y latitud del centro inicial del mapa
  
* map.initialZoomLevel=5

  Nivel de zoom inicial

layers.json
............

Define la estructura de capas del proyecto. Consiste en un elemento JSON con tres propiedades::

	{
		"wmsLayers" : [],
	
		"portalLayers" : [],
	
		"groups" : []
	}

* ``wmsLayers`` define las capas WMS que tendrá el mapa. El orden en el que estas capas aparecen en el array ``wmsLayers`` define el orden de las capas en el dibujado del mapa. Cada capa consistirá en un elemento con las siguientes propiedades:

	* id: Identificado de la capa
	* baseUrl: URL del servidor WMS que sirve la capa
	* wmsName: Nombre de la capa en el servicio WMS
	* imageFormat: Formato de imagen a utilizar en las llamadas WMS
	* visible: Si la capa es utilizada para visualizarse en el mapa o sólo para otras cosas (petición de información, por ejemplo).
	* queryable: Si se pretende ofrecer herramienta de información para la capa o no
	* zIndex: Posición en la pila de dibujado
	* legend: Nombre del fichero imagen con la leyenda de la capa. Estos ficheros se acceden en static/loc/{lang}/images
	* label: Título de la leyenda
	* sourceLink: URL del proveedor de los datos
	* sourceLabel: Texto con el que presentar el enlace especificado en sourceLink
	* wmsTime: Instantes de tiempo en ISO8601 separados por comas
	
	Por ejemplo::
		
		{
			"wmsLayers" : [
				{
					"id" : "provinces",
					"baseUrl" : "http://demo1.geo-solutions.it/diss_geoserver/wms",
					"wmsName" : "unredd:drc_provinces",
					"imageFormat" : "image/png8",
					"visible" : true,
					"sourceLink" : "http://www.wri.org/publication/interactive-forest-atlas-democratic-republic-of-congo",
					"sourceLabel" : "WRI",
					"queryable" : true,
					"wmsTime" : "2007-03-01T00:00,2008-05-11T00:00,2005-03-01T00:00"
				}
			],
			...
		}

* ``portalLayers`` define las capas que aparecen visibles al usuario. Una ``portalLayer`` puede contener varias ``wmsLayers``. Cada ``portalLayer`` puede contener los siguientes elementos:

	* id: id de la capa
	* label: Texto con el nombre de la capa a usar en el portal. Si se especifica entre ${ }, se intentará obtener la traducción de los ficheros .properties existentes en el directorio ``messages`` del  directorio de configuración del portal.
	* infoFile: Nombre del fichero HTML con información sobre la capa. El fichero se accede en static/loc/{lang}/html. En la interfaz gráfica se representa con un botón de información al lado del nombre de la capa 
	* inlineLegendUrl: URL con una imagen pequeña que situar al lado del nombre de la capa en el árbol de capas
	* active: Si la capa está inicialmente visible o no
	* layers: Array con los identificadores de las ``wmsLayers`` a las que se accede a través de esta capa
	
	Por ejemplo::
		
		{
			"wmsLayers" : [
				{
					"id" : "wms_provinces",
					"baseUrl" : "http://demo1.geo-solutions.it/diss_geoserver/wms",
					"wmsName" : "unredd:drc_provinces",
					"imageFormat" : "image/png8",
					"visible" : true,
					"sourceLink" : "http://www.wri.org/publication/interactive-forest-atlas-democratic-republic-of-congo",
					"sourceLabel" : "WRI",
					"queryable" : true,
					"wmsTime" : "2007-03-01T00:00,2008-05-11T00:00,2005-03-01T00:00"
				}
			],
			"portalLayers" : [
				{
					"id" : "provinces",
					"active" : true,
					"infoFile" : "provinces_def.html",
					"label" : "${provinces}",
					"layers" : [ "wms_provinces" ],
					"inlineLegendUrl" : "http://demo1.geo-solutions.it/diss_geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=unredd:drc_provinces&TRANSPARENT=true"
				}
			],
			...
		}
	
* ``groups`` define la estructura final de las capas en el árbol de capas de la aplicación. Cada elemento de ``groups`` contiene:

	* id: id del grupo
	* label: Igual que en ``portalLayer``
	* infoFile: Igual que en ``portalLayer``
	* items. Array de otros grupos, con la misma estructura que este elemento (recursivo).
	
	Por ejemplo::
		
		{
			"wmsLayers" : [
				{
					"id" : "wms_provinces",
					"baseUrl" : "http://demo1.geo-solutions.it/diss_geoserver/wms",
					"wmsName" : "unredd:drc_provinces",
					"imageFormat" : "image/png8",
					"visible" : true,
					"sourceLink" : "http://www.wri.org/publication/interactive-forest-atlas-democratic-republic-of-congo",
					"sourceLabel" : "WRI",
					"queryable" : true,
					"wmsTime" : "2007-03-01T00:00,2008-05-11T00:00,2005-03-01T00:00"
				}
			],
			"portalLayers" : [
				{
					"id" : "provinces",
					"active" : true,
					"infoFile" : "provinces_def.html",
					"label" : "${provinces}",
					"layers" : [ "wms_provinces" ],
					"inlineLegendUrl" : "http://demo1.geo-solutions.it/diss_geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=unredd:drc_provinces&TRANSPARENT=true"
				}
			],
			"groups" : [
				{
					"id" : "base",
					"label" : "${base_layers}",
					"infoFile": "base_layers.html",
					"items" : ["provinces"]
				}
			]
		}
	
	
	
	
