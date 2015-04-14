Hoja de ruta para la publicación del portal de diseminación del SNMB
====================================================================

Esta hoja de ruta pretende ser una guía para la publicación de datos en el servidor prototipo para el portal de diseminación de datos del Sistema Nacional de Monitoreo de Bosques, que consiste básicamente en un servidor de bases de datos PostgreSQL y una instancia de GeoServer corriendo sobre Apache Tomcat.

Se parte de los siguientes requisitos:

* existe un servidor con acceso público a internet
* es posible realizar tareas administrativas en dicho servidor
* disponemos de los datos listos para su publicación. En este caso se supone que son ficheros shapefile y geotiffs. 

Los pasos a seguir serían los siguientes:

#. Inventario de los datos a publicar. Listado de capas indicando para cada capa:

	* formato: raster o vector, geotiff, ecw, shapefile, etc.
	* número de instancias temporales. Por ejemplo: 2005, 2007, 2011. Otro ejemplo: Diario desde 2002.
	* Tamaño aproximado de cada instancia. 1Mb, 10Mb, 100Mb, 1Gb, 10Gb, ... 
	* periodicidad de la actualización: Diario, mensual, anual, cada años.
	* ¿se debe publicar con una leyenda específica? Sí / No. En caso afirmativo indicar el formato en que se puede exportar la leyenda: SLD, QGIS, ArcMap, etc.

#. Instalación del servidor: PostgreSQL, GeoServer y portal. Incluye la configuración del portal para las distintas herramientas, como feedback, estadísticas, etc.

#. Carga de los datos en PostgreSQL. Transferencia de los ficheros al servidor en un directorio temporal para su carga inmediata en PostgreSQL. Una vez cargados, los fichero se eliminan del servidor ya que sólo se accederá a la copia existente en la base de datos.

#. Publicación de los datos de PostgreSQL desde GeoServer, con la simbología por defecto.

#. Configuración de las capas publicadas por GeoServer en el portal.

#. Configuración de la simbología de las capas. Configuración de metatileado para etiquetado de forma correcta.

#. Configuración del aspecto temporal: habilitación de la dimensión temporal en GeoServer, configuración en el portal.

#. Personalización del portal. Creación de una versión con los plugins de interés, cambios de estilo, cabezal, logos.

#. Optimizaciones

   * A nivel informático: parámetros máquina virtual, tomcat, etc.
   * A nivel de simbología: leyendas más sencillas y rápidas de dibujar para escalas más pequeñas.
   * A nivel de datos: Generación de versiones más ligeras de las capas vectoriales consultables. Optimizaciones de los datos raster.
   * A nivel de protocolo: Utilización de GeoWebCache (caché de teselas)

#. Programación de copias de seguridad 

#. Robustecimiento del servicio. Herramientas de monitoreo, scripts whatchdog.