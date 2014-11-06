.. _project_architecture:

Estructura del repositorio
============================

Cliente ligero
---------------

El cliente Javascript es una aplicación modular que se comunica mediante llamadas asíncronas con los servicios web.

Desde el punto de vista del navegador, la aplicación tiene la siguiente estructura::

	unredd-portal
	 |- modules/	-> RequireJS modulos y sus estilos
	 |- jslib/	-> Librerías Javascript usadas por los módulos: OpenLayers, RequireJS, etc.
	 |- styles/ 	-> Hojas CSS generales (de JQuery UI, etc.)
	 |- indicators	-> Devuelve una lista con información de los indicadores de un objeto en una capa
	 |- ...			-> Otros servicios
	 \- index.html	-> Documento HTML de la aplicación

Así, si tubiéramos que añadir una nueva funcionalidad en el cliente, tendríamos que meter los módulos en el directorio ``modules``, las hojas de estilos en ``styles`` o en ``modules`` y las librerías que se utilicen en ``jslib``.

Sin embargo, repartir todos estos ficheros en distintos directorios complicaría el proceso de añadir y quitar plugins a la aplicación, por lo que el código fuente está organizado tratando de agrupar todos esos ficheros por funcionalidad en "plugins".

Plugins, cargador de plugins, aplicaciones
--------------------------------------------

Así, para la parte cliente agruparemos los HTML, CSS y Javascript necesarios para implementar las funcionalidades que nos interesen en artefactos que llamaremos **plugins**.

Para la aplicación que queremos desarrollar, habrá que utilizar uno o más plugins, que tendrán que ser cargados mediante el **cargador de plugins**.

Por último, tendremos que desplegar una **aplicación**, diciéndole al cargador de plugins qué plugins queremos incluir en el resultado final

Así, una **aplicación** incluirá uno o más **plugins** que serán cargados mediante el **cargador de plugins**.

Estructura del código fuente
------------------------------

¿Cómo están estructurados los plugins, el cargador de plugins y las aplicaciones en el código fuente?

La aplicación es implementada por varios proyectos Java estructurados de la siguiente manera::

	portal
	 |- core/		-> Librería que contiene el cargador de plugins y algunas funcionalidades básicas como el manejo de errores.
	 |- base/		-> Plugin que contiene la funcionalidad básica de la aplicación: árbol de capas, panel de leyenda, mapa, etc. 
	 \- demo/		-> Aplicación incluye el plugin base.

El proyecto ``base`` contendrá los módulos RequireJS, librerías Javascript y estilos CSS necesarios para tener todas las funcionalidades del portal, mientras que el proyecto ``demo`` especificará de alguna manera que quiere incluir ``base``. 

Estructura por defecto Maven
...............................

Todos los proyectos del portal utilizan Maven como herramienta de compilación, adaptándose a la estructura por defecto que por convención tienen los proyectos Maven:

- src/main/java: Código fuente Java
- src/main/resources: Recursos usados por el código Java, componentes de la parte cliente (CSS, módulos y librerías Javascript, etc.)
- src/test/java y src/test/resources: Tests automatizados
- pom.xml: Descriptor del proyecto Maven, donde se definen las dependencias entre proyectos.

Adicionalmente a estos directorios, las aplicaciones como ``demo`` incorporan un directorio adicional:

- src/main/webapp: Raíz de la aplicación web

Todos los recursos que se sitúen aquí se ofrecerán via HTTP en la raíz de la aplicación por lo que es el lugar ideal para los contenidos estáticos y específicos de la aplicación. Además, incluye el directorio ``WEB-INF`` específico de aplicaciones Java, con el descriptor de despliegue ``web.xml``

.. _plugin_project_structure:

Estructura proyectos plugin
............................

Los proyectos plugin constan de los siguientes artefactos:

Desarrollos parte cliente
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Si los proyectos de los que estamos hablando son Java ¿cómo se incluyen artefactos del cliente (módulos RequireJS, CSS, etc.)?

Las funcionalidades para la parte cliente se encuentran en el directorio ``nfms`` dentro de ``src/main/resources``. Estas funcionalidades consisten en módulos RequireJS, hojas de estilo CSS, librerías Javascript, etc. organizados siguiendo esta estructura::

	nfms
	 |- xxx-conf.json (descriptor del plugin. xxx es el nombre del plugin. E.g.: base-conf.json)
	 |- modules/ (módulos RequireJS)
	 |- jslib/ (librerías Javascript utilizadas)
	 \- styles/ (hojas de estilo CSS)

Este directorio se encuentra en ``src/main/resources`` porque Maven por defecto incluirá todo lo que haya ahí en el JAR que genere al empaquetar.

Por ejemplo, en el proyecto ``base`` existe el directorio ``src/main/resources`` que contiene ``nfms/modules/layer-list.js`` y ``nfms/jslib/OpenLayers/OpenLayers.unredd.js``, entre otros. Cuando Maven genere el JAR, el directorio ``nfms`` aparecerá en la raíz de los contenidos del JAR.

Descriptor parte cliente
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Es un fichero compuesto por el nombre del plugin y "-conf.json" que reside en la raíz del directorio ``nfms`` y que contiene información descriptiva sobre el plugin. Actualmente el fichero sólo contiene información sobre las librerías de terceros que utiliza el plugin y sus dependencias. Esta información es necesaria para que RequireJS cargue las librerías en el orden correcto.

El formato del fichero es el siguiente::

	 {
		requirejs: {
			paths : {
				"<id-libreria>" : "<ruta relativa a 'modules'>",
				...
			},
			shim : {
				"<id-libreria>" : [ "<id-dependencia1>", "<id-dependencia2>", ... ],
				...
			},
		}
	}

Ejemplo::

	 {
		requirejs: {
			paths : {
				"jquery-ui" : "../jslib/jquery-ui-1.10.4.custom",
				"fancy-box": "../jslib/jquery.fancybox.pack",
				"openlayers": "../jslib/OpenLayers/OpenLayers.unredd",
				"mustache": "../jslib/jquery.mustache"
			},
			shim : {
				"fancy-box": [ "jquery" ],
				"mustache": [ "jquery" ]
			},
		}
	}

Parte servidora
^^^^^^^^^^^^^^^^^^^^^^^^^^^

El descriptor de la parte servidora es ``META-INF/web-fragment.xml`` y se encuentra en ``src/main/resources``. Sigue el estándar Servlet3 de Java y contiene referencia a las clases Java que implementan los servicios en él declarados.

La implementación de los servicios estará en ``src/main/java``.

.. _application_project_structure:

Estructura proyectos aplicación
..................................

Los proyectos aplicación constan de los siguientes artefactos.

TODO 

.. _cargador_plugins:

Cargador de plugins
--------------------

Para desplegar la aplicación se genera un WAR (Web application ARchive) que contendrá los ficheros JAR pertenecientes a los plugins y sus dependencias.

Cuando este WAR se despliega y se inicia la aplicación, se analizan todos los JARs existentes dentro del WAR en busca de módulos RequireJS, estilos y librerías externas.

* los paquetes ``modules`` y ``styles`` son escaneados en busca de módulos javascript y estilos::  

	nfms
	 |- xxx-conf.json
	 |- modules/ (escaneado en busca de .js y .css)
	 |- jslib/
	 \- styles/ (escaneado en busca de .css)

  De esta manera, cualquier fichero .css existente en cualquier de los dos paquetes será importado al cargar la aplicación. Igualmente, todo fichero .js existente en ``modules`` será cargado inicialmente por RequireJS al iniciar la aplicación.

* el descriptor del plugin es analizado.

Tras este proceso, todos estos recursos encontrados serán accesibles via HTTP.

Despliegue
-----------

Como visto en el punto :ref:`cargador_plugins`, todos los JARs incluídos en la aplicación son analizados en busca de módulos, librerías, estilos, etc. Así, para componer una aplicación que incluya los plugins que nos interesan basta con especificar en el pom.xml la dependencia al proyecto del plugin.

Cuando este proyecto es incluido como dependencia en un proyecto, por ejemplo ``demo``, aparecerá como JAR dentro del WAR y sus contenidos serán analizados y accesibles via HTTP.

Optimización
---------------

Durante el proceso de empaquetado de una aplicación como fichero WAR se realiza un proceso de optimización de las hojas de estilos CSS y el código Javascript.

Este proceso consiste en la generación de dos recursos optimizados para estilos CSS y código Javascript en el directorio ``optimized`` del espacio web de dicha aplicación, es decir, en ``src/main/webapp/``.

Estos dos ficheros contienen respectivamente todos los estilos CSS y todo el código Javascript proporcionado por todos los plugins incluidos en la aplicación. Además el contenido está comprimido para que la descarga desde el navegador sea más ligera.

Así, cuando desplegamos el fichero WAR de la aplicación, éste contiene tanto las hojas de estilo y módulos Javascript individuales como los dos ficheros optimizados. Para seleccionar el modo optimizado basta con poner la variable de entorno MINIFIED_JS=true. 

A continuación podemos observar lo que nos arroja el fichero ``index.html`` en cada caso. Primero sin optimizar::

	<html>
	<head>
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	
	<link rel="icon" type="image/png" href="static/img/favicon.png">
	
	<link rel="stylesheet" href="modules/banner.css">
	<link rel="stylesheet" href="modules/info-dialog.css">
	<link rel="stylesheet" href="modules/layer-list.css">
	<link rel="stylesheet" href="modules/layout.css">
	<link rel="stylesheet" href="modules/legend-button.css">
	<link rel="stylesheet" href="modules/legend-panel.css">
	<link rel="stylesheet" href="modules/scale.css">
	<link rel="stylesheet" href="modules/time-slider.css">
	<link rel="stylesheet" href="modules/toolbar.css">
	<link rel="stylesheet" href="modules/zoom-bar.css">
	<link rel="stylesheet" href="styles/jquery-ui-1.10.3.custom.css">
	<link rel="stylesheet" href="styles/jquery.fancybox.css">
	
	<script src="config.js"></script>
	<!--<script src="js/require.js" data-main="modules/main"></script>-->
	<script src="jslib/require.js"></script>
	<script>
	    require.config({
	        paths: {
	            "main": "modules/main"
	        }
	    });
	    require(["main"]);
	</script>
	
	<link rel="stylesheet" href="static/overrides.css"/>
	</head>
	<body>
	</body>
	</html>

Y ahora con la variable MINIFIED_JS = true::

		<html>
		<head>
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		
		<link rel="icon" type="image/png" href="static/img/favicon.png">
		
		<link rel="stylesheet" href="optimized/portal-style.css">
		
		<script src="config.js"></script>
		<!--<script src="js/require.js" data-main="modules/main"></script>-->
		<script src="jslib/require.js"></script>
		<script>
		    require.config({
		        paths: {
		            "main": "optimized/portal"
		        }
		    });
		    require(["main"]);
		</script>
		
		<link rel="stylesheet" href="static/overrides.css"/>
		</head>
		<body>
		</body>
		</html>

Podemos observar cómo en lugar de cargarse todos los CSS de forma separada, se carga un único CSS en ``optimized/portal`` y que el modulo ``main`` se mapea a ``optimized/portal.js``

.. _funcionalidades_servidor::

Programación de servicios
------------------------------

El código en los módulos RequireJS puede realizar peticiones a los servicios de la aplicación. De igual modo que en la parte cliente, un plugin puede contribuir con servicios a la aplicación final.

La implementación de estos servicios se basa en la especificación Java Servlet 3.0 y consistirá en la implementación de uno o más *Servlets* definidos en el descriptor de despliegue. Este puede encontrarse en dos ficheros.

El primero es ``WEB-INF/web.xml`` del espacio web, es decir en ``src/main/webapp/WEB-INF/web.xml`` en la estructura por defecto de Maven. Este fichero es el descriptor de despliegue propiamente dicho, y en él se pueden definir todos los servlets necesarios en las aplicaciones, como ``demo``.

Sin embargo, en los plugins no es posible utilizar el descriptor de despliegue (web-xml) ya que no se genera ningún fichero WAR sino un JAR (que se incluirá en un WAR). En este caso, la especificación Servlet 3.0 define que las librerías JAR usadas por una aplicación WAR pueden contribuir al descriptor de despliegue mediante un fichero ``META-INF/web-fragment``. Es el caso por ejemplo del plugin ``base`` que incluye distintos servicios para acceder a indicadores sobre objetos de algunas capas del mapa::

	<?xml version="1.0" encoding="UTF-8"?>
	<web-fragment version="3.0" xmlns="http://java.sun.com/xml/ns/javaee"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-fragment_3_0.xsd">
	
		<!-- indicators -->
		<servlet>
			<servlet-name>indicator-list-servlet</servlet-name>
			<servlet-class>org.fao.unredd.indicators.IndicatorListServlet</servlet-class>
		</servlet>
		<servlet-mapping>
			<servlet-name>indicator-list-servlet</servlet-name>
			<url-pattern>/indicators</url-pattern>
		</servlet-mapping>
		<servlet>
			<servlet-name>indicator-data-servlet</servlet-name>
			<servlet-class>org.fao.unredd.indicators.IndicatorDataServlet</servlet-class>
		</servlet>
		<servlet-mapping>
			<servlet-name>indicator-data-servlet</servlet-name>
			<url-pattern>/indicator</url-pattern>
		</servlet-mapping>
	</web-fragment>
