> ### TODO ¿Esto va aquí?


Esta lista de buenas prácticas se basa en la experiencia de múltiples instalaciones de GeoServer a lo largo de los años.

Pretende repasar las cuestiones básicas a tener en cuenta para un rendimiento aceptable de GeoServer, pero es una lista conservadora y razonable: No se han considerado situaciones excepcionales, ni se ha tratado de optimizar a toda costa. Se ha preferido conservar una instalación y mantenimiento lo más fáciles posible.

Esta lista se puede ir modificando o ampliando con todo aquello que se considere útil como buena práctica general. Los detalles sobre cómo realizar cada tarea están detallados a lo largo de este mismo manual.


> Para casos en que sea necesario profundizar: [GeoServer on Steroids](http://es.slideshare.net/geosolutions/gs-steroids-foss4ge2014).


## Requisitos Hardware

* Al menos 2 GB de RAM, hasta 4 si es posible.
* 4 núcleos de procesador.
* Si es posible, usar un disco lo más rápido posible (SSD local) para almacenar los datos y especialmente la GeoWebCache.

## Sistema Operativo

* Utilizar versión más reciente de Ubuntu LTS: Ubuntu 14.04 Server 64 bits.
* Mantener actualizados los paquetes de sistema (apt-get upgrade & apt-get update).
* Activar la actualizaciones automáticas (unattended-upgrades).
* Instalar todo lo que sea posible del gestor de paquetes del propio SO (evitar en lo posible instalaciones manuales y repositorios de terceros).

## Paquetes de Software

* Instalar GDAL (1.10)
* Instalar PostgreSQL (9.3) y PostGIS (2.1)
* Usar OpenJDK 7. Instalar manualmente las JAI e ImageIO nativas.
* Instalar Tomcat7 y configurar el /etc/default/tomcat convenientemente, reservando hasta 2 GB para la JVM, pero nunca más de la disponible, o el swapping nos arruinará el rendimiento).
* Usar la última versión de GeoServer 'stable'.

## Configuración GeoServer

* Comprobar que el Data directory apunta a la ubicación deseada (típicamnete, /var/geoserver).
* Comprobar que la JVM que se está usando es la deseada (OpenJDK 7).
* Comprobar que native JAI y Native JAI ImageIO están a "true".
* Deshabilitar los servicios que no vayan a usarse.
* Borrar todos los workspaces, styles, datasources y layers que no se usen (típicamente, los que vienen de ejemplo).
* Configurar el logging a "PRODUCTION_LOGGING".
* Limitar el número de SRS del servicio WMS.
* Habilitar la creación de cachés en EPSG:900913 por defecto, donde:

  * Las capas Raster se cachearán en JPEG.
  * Las capas Vectoriales se cachearán en PNG8.
  * Los grupos de capas se cachearán en ambos formatos (JPEG, PNG8).
  * Si alguna capa ráster requiere de transparencia, se cambiará la configuración de GWC de JPEG a PNG8 sólo para ésa capa.

## Datos Vectoriales

* Limpiar y simplificar los datos previamente:

  * Es preferible varios polígonos independientes que un sólo multipolígono muy complejo.
  * Evitar solapamiento y errores topológicos.
  * Simplificar las geometrías hasta una resolución lo suficientemente buena. Para geometrías muy detalladas, utilizar diferentes resoluciones a diferentes escalas.
  * Reproyectar al CRS en que se vayan a consumir más habitualmente los datos (para el Portal, EPSG:3857).

* Asegurarse que los datos están bien indexados:

  * Al importar los datos, utilizar la opción -I de shp2pgsql para generar automáticamente un índice espacial.
  * O bien, para datos ya cargados, comprobar que existe un índice o crearlo con CREATE INDEX [...] USING GIST.
  * Indexar también otros campos por los que se filtre habitualmente.
  * Comprobar que las tablas tienen definida una Primary Key (o, de no ser posible, activar OIDS para esa tabla).

* Tras actualizar una capa vectorial, ejecutar un VACUUM ANALYZE. Para capas que se editen contínuamente, programar la ejecución periódica de VACUUM ANALYZE.

> Si GeoServer debe acceder a una Base de Datos PostGIS remota (alojada en otra máquina), asegurarse de que la conexión de red entre ambas máquinas es de excelente calidad, y si puede ser dedicada: la transferencia de datos va a ser masiva.

## Datos Raster

* Usar el tipo de dato para cada celda lo más compacto posible. Por ejemplo, para un DEM quizá baste con un tipo Integer, y no haga falta un Double. El tipo Byte, con valores entre 0 y 255, suele ser más que suficiente para clasificaciones con unas pocas categorías, índices de vegetación, o indicadores en tanto por ciento.
* Reproyectar al CRS en que se vayan a consumir más habitualmente los datos (para el Portal, EPSG:3857), y recortar a la zona de interés (gdalwarp, gdalinfo).
* Convertir los datos a GeoTIFF sin comprimir, con tiling interno y con overviews (gdal_translate, gdaladdo).
* Cada fichero GeoTIFF debería rondar los 2 GB. Para mosaicos, trocear en caso de que pasen de 4 GB, o agrupar si quedan por debajo de 1 GB.
* Para coberturas enormes (por ejemplo, ortofoto nacional de gran resolución), hay que aplicar técnicas excepcionales: compresión interna JPEG, ImagePyramid.

> No se recomienda que los datos raster (habitualmente GEOSERVER_DATA_DIR) estén en una unidad remota, puesto que la transferencia de datos para GeoTIFF sin comprimir es todavía más masiva que en el caso de datos vectoriales.