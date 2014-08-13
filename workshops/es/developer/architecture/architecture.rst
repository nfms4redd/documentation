Estructura de la aplicación
============================

Client perspective
--------------------

El cliente Javascript es una aplicación modular basada en RequireJS que se comunica mediante llamadas AJAX con los servicios web.

Desde el punto de vista del cliente, la aplicación tiene la siguiente estructura::

	unredd-portal
	 |- modules/	-> RequireJS modulos y sus estilos
	 |- jslib/	-> Librerías Javascript usadas por los módulos: OpenLayers, RequireJS, etc.
	 |- styles/ 	-> Hojas CSS generales (de JQuery UI, etc.)
	 |- ...		-> Servicios Java (pueden ser llamados de cualquier manera, e.g.: indicators/ -> devuelve una lista con información de los indicadores de un objeto en una capa)
	 \- index.html	-> Documento HTML de la aplicación

Estructura del proyecto
-------------------------

La aplicación es implementada por varios proyectos Java estructurados de la siguiente manera::

	portal
	 |- core/		-> Librería que contiene los componentes que forman el núcleo del sistema, tales como manejo de errores, carga de capas, etc.
	 |- base/		-> Librería que contiene los componentes básicos de la aplicación, tales como el árbol de capas, panel de leyenda, mapa, etc. 
	 |- demo/		-> WAR que incluye todos los componentes de core y base.
	 |- ...
	 |- argentina/		-> WARs específicos para cada país que contiene componentes específicos 	e incluyen core y base. 

Programación del cliente
-------------------------

Cada uno de estos proyectos puede contribuir contenidos a cualquier punto de la estructura del punto anterior: styles, modules, services, etc. Esto se hace incluyendo los recursos en el classpath (``src/main/resources``), en el paquete ``nfms``::

	nfms
	 |- modules
	 |- jslib
	 \- styles

Bastará con que dicha estructura esté presente dentro de uno de los JARs en ``WEB-INF/lib`` para que sus directorios ``modules``, ``jslib`` y ``styles`` sean accesibles via HTTP.

Por ejemplo, en el proyecto ``core`` existe el directorio ``src/main/resources`` que contiene ``nfms/modules/main.js`` y ``nfms/jslib/require.js``, entre otros. Cuando este proyecto es incluido como dependencia en un proyecto, por ejemplo ``demo``, aparecerá como JAR en ``WEB-INF/lib`` y por tanto estos recursos serán accesibles en las urls ``http://localhost:8080/unredd-portal/modules/main.js`` y ``http://localhost:8080/unredd-portal/jslib/require.js``. Lo mismo sucede para cualquier recurso existente en ``nfms/modules/``, ``nfms/jslib/`` y ``nfms/styles/``.

**Escaneado**

Además de ser accesibles via HTTP, los paquetes ``modules`` y ``styles`` son escaneados en busca de módulos javascript y estilos::  

	nfms
	 |- modules (escaneado en busca de .js y .css)
	 |- jslib
	 \- styles (escaneado en busca de .css)

De esta manera, cualquier fichero .css existente en cualquier de los dos paquetes será importado al cargar la aplicación. Igualmente, todo fichero .js existente en ``modules`` será cargado inicialmente por RequireJS al iniciar la aplicación.

Programación de los servicios
------------------------------

El código en los módulos RequireJS puede realizar peticiones a los servicios de la aplicación. De igual modo que en la parte cliente, cualquiera de los proyectos puede contribuir con servicios a la aplicación final símplemente incluyéndolo como dependencia.

La implementación de estos servicios se basa en la especificación Java Servlet 3.0 y consistirá en la implementación de uno o más *Servlets* definidos en el descriptor de despliegue. Este puede encontrarse en dos ficheros.

El primero es ``WEB-INF/web.xml`` del espacio web, es decir en ``src/main/webapp/WEB-INF/web.xml``. Este fichero es el descriptor de despliegue propiamente dicho, y en él se pueden definir todos los servlets necesarios en aquellos proyectos que sean de tipo WAR, como ``demo``.

Sin embargo, core y base no son proyectos web sino simples librerías. En tal caso, la especificación Servlet 3.0 define que las librerías usadas por una aplicación WAR (como ``demo``) pueden contribuir al descriptor de despliegue mediante un fichero ``META-INF/web-fragment``. Es el caso por ejemplo de la librería ``core`` que incluye distintos servlets para gestión de errores, secuencia de inicio de la aplicación, etc. y que serán ofrecidos por cualquier aplicación que incluya el JAR de ``core`` en ``WEB-INF/lib`` (obviamente, en un contenedor JEE que implemente la especificación Servlet 3.0, como Tomcat 7).

Estructura del código fuente
------------------------------

Todos los proyectos del portal utilizan Maven como herramienta de compilación, adaptándose a la estructura por defecto que por convención tienen los proyectos Maven:

- src/main/java: Código fuente Java
- src/main/resources: Recursos usados por el código Java
- src/test/java y src/test/resources: Tests automatizados
- pom.xml: Descriptor del proyecto Maven.

Adicionalmente a estos directorios, las aplicaciones JEE como ``demo`` incorporan un directorio adicional:

- src/main/webapp: Raíz de la aplicación web

Este directorio contendrá todos los recursos que se ofrecerán via HTTP y que son específicos del proyecto ``demo``. Además incluye el directorio ``WEB-INF`` con el descriptor de despliegue y un directorio ``default_config``, que es una copia inicial del directorio de configuración utilizado por la aplicación. En él podemos encontrar:

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
	
	
	
	
