****************************************************************************
Puntos de la instalación a chequear, evaluación del estado de la instalación
****************************************************************************

Previo a la realización de la evaluación de la instalación del servidor, se recomienda revisar en la documentación
el punto `Checklist Rendimiento <http://snmb-admin.readthedocs.io/en/latest/performance_checklist.html?>`_ y revisar
los puntos de la lista para comprobar el estado de la instalación de GeoServer.

Java
====
Para obtener la versión de Java instalada en el servidor del visor será necesario ejecutar::

  $ java -version

desde la consola del servidor. la respuesta nos mostrará un mensaje semejante a este::

  java version "1.8.0_101"
  Java(TM) SE Runtime Environment (build 1.8.0_101-b13)
  Java HotSpot(TM) 64-Bit Server VM (build 25.101-b13, mixed mode)

donde podrán cambiar los números de las versiones.

Java ImageIO & JAI
==================

Java ImageIO y JAI son dos librerias de Java importantes a la hora del manejo de imágenes por GeoServer.
Para comprobar la instalación de dichas librerías, deberemos ir a la pestaña de *Server Status*:

.. image:: _static/server_status.png
    :align: center

y verificar que los valores *Native JAI* y *Native JAI* ImageIO están a *true*:

.. image:: _static/native.png
    :align: center

`Enlace a la documentación sobre el proceso de instalación de las librerías JAI. <http://snmb-admin.readthedocs.io/en/latest/geotalleres/geoserver-install/geoserver_install.html?highlight=imageio>`_

GeoServer
=========

Versión
-------
GeoServer se actualiza de versión bastante a menudo. Es recomendable tener el servidor actualizado a las últimas versiones, o por lo menos a la última versión LTS. Las versiones
LTS son aquellas sobre las que se tiene soporte de los desarrolladores durante un periodo más largo de tiempo que el que tardan en sacar una nueva versión.

Para revisar la versión de GeoServer accederemos al servidor desde nuestro cliente web y comprobaremos en la pantalla de bienvenida la versión del servidor.

.. image:: _static/version.png
    :align: center

.. warning::
    Solicitar información sobre el proceso de actualización de GeoServer a las versiones LTS en caso de necesitarlo.

GeoWebCache
===========

PostgreSQL & PostGIS
====================

Datos
=====

Vectorial
---------

Creación de índices
*******************

Los índices espaciales permiten a PostGIS realizar consultas espaciales de manera más efectiva, filtrando primero por los bounding box de las geometrías a aquellas que cumplen la
relación que se está comprobando y realizando la comprobación de la relación entre el resultado de este primer filtrado.

Para comprobar la existencia de índices espaciales en nuestras tablas, deberemos:

1. Conectarnos a nuestra base de datos con el cliente que utilicemos a menudo (se recomienda el uso de `pgAdmin3 <https://www.pgadmin.org/>`_)
2. Seleccionamos la tabla que deseamos inspeccionar:

.. image:: _static/table_pgadmin.png
    :align: center

3. Comprobamos en el panel *SQL Pane* la información de la tabla en SQL:

.. image:: _static/info_table.png
    :align: center

4. Comprobamos que existe el índice sobre la tabla verificando que aparece la sentencia de creación del índice * create index ... *:

.. image:: _static/info_table_index.png
    :align: center

`Mas información sobre índices espaciales <https://geotalleres.readthedocs.io/es/latest/postgis-indexacion-espacial/indexacion_espacial.html>`_

Raster
------

Portal
======

Logos y estilos propios
-----------------------

Optimización y seguridad
========================

Minificación del código del portal
==================================

La parte del portal que se ejecuta en el navegador web está desarrollada en el lenguaje JavaScript. Este lenguaje se ejecuta en el navegador que estemos utilizando,
pero se descarga desde los servidores en los que tenemos publicados el portal. Cuanto menos ocupen los archivos, menos tiempo tardarán en descargarse y cuantos menos archivos tenga
que descargarse nuestro navegador menos tardará en poder cargar el portal en el cliente. Para ello existen diferentes estrategias, estando entre ellas la minificación de los ficheros
del portal y la concatenación de los ficheros de código en el mismo fichero (unificación).

Para comprobar si nuestro portal se encuentra optimizado:

1. Abrir el portal desde nuestro navegador web.
2. Activar las herramientas de desarrollo de nuestro navegador web (*Ctrl + Mayus + I* en Google Chrome)
3. En la pestaña de *Sources* (en Google Chrome), podremos observar los archivos que componen la aplicación:

.. image:: _static/source_GC.png
    :align: center

Si nuestro portal se encuentra optimizado la estructura de carpetas será similar a la de la siguiente imagen:

.. image:: _static/optimized.png
    :align: center

donde encontraremos una carpeta *optimized* en la que se encuentran minificados y unificados todos los archivos de la aplicación.
En caso de no tener el portal optimizado, la estrucutra de carpetas será similar a la siguiente:

.. image:: _static/notoptimized.png
    :align: center

donde se podrán observar todos los archivos que componen la aplicación.

.. note::
  Para tener una versión optimizada del portal deberá empaquetar desde el código fuente de la aplicación utilizando la orden *mvn [install|package] -Poptimized* y
  luego configurar el arranque de Tomcat para que utilice la versión optimizada de los ficheros mediante el uso del parámetro *MINIFIED_JS=true*.

.. warning::
  Solicite capacitación sobre desarrollo y puesta en producción.

Monitorización
==============

Backups
=======
En la instalación del portal existen tres partes sobre las que deberemos realizar copias de seguridad:

1. PostgreSQL/PostGIS
2. GeoServer
3. Portal

Creación de copias de seguridad en PostgreSQL
---------------------------------------------
Creación de copias de seguridad en GeoServer
---------------------------------------------
Creación de copias de seguridad para el portal
----------------------------------------------
