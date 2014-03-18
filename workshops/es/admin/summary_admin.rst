Resumen administración
=========================

.. note::

	=================  ================================================
	Fecha              Autores
	=================  ================================================             
	24 Junio 2013		* Fernando González (fernando.gonzalez@fao.org)
	18 Marzo 2014		* Víctor González (victor.gonzalez@geomati.co)
	=================  ================================================	

	©2013 FAO Forestry 
	
	Excepto donde quede reflejado de otra manera, la presente documentación se halla bajo licencia : Creative Commons (Creative Commons - Attribution - Share Alike: http://creativecommons.org/licenses/by-sa/3.0/deed.es)

Java
-----

- Directorio de instalación: /usr/lib/jvm/jdk1.6.0_45
- Enlace simbólico: /usr/lib/jvm/default-java
- Exntensiones imageIO y JAI instaladas

Tomcat 7
---------

* Directorio de instalación: /var/apache-tomcat-7.0.47
* Enlace simbólico: /var/tomcat
* Variables de entorno: /var/tomcat/bin/setenv.sh
* Servicio tomcat7: (/etc/init.d/ubuntuTomcatRunner.sh, /etc/init.d/tomcat7)

Apache
--------

Configuración proxy AJP (redirigir peticiones a Tomcat)

* Fichero de configuración: /etc/apache2/mods-available/proxy_ajp.conf
* Enlace simbólico al fichero anterior para habilitar el módulo: /etc/apache2/mods-enabled/proxy_ajp.conf
* Servicio apache2

Repositorio Ubuntu GIS
-------------------------

Se añade el repositorio "ppa:ubuntugis/ppa" para la instalación de GDAL y PostGIS. La instalación de GDAL y PostGIS se hace vía "apt-get".

GeoServer
---------

* Instalado como war: /var/tomcat/webapps/geoserver.war
* Directorio de datos: /var/geoserver/data

Portal
-------

Directorio de instalación: /var/portal

Dentro de dicho directorio:

	* Configuración general: portal.properties
	* Árbol de capas: layers.json
	* Contenido estático: static/
	* Imágenes internacionalizadas: static/loc/<lang>/images (donde <lang> corresponde con el idioma en el que se encuentran los recursos)
	* HTML internacionalizado: static/loc/<lang>/html (donde <lang> corresponde con el idioma en el que se encuentran los recursos)
	* Ficheros internacionalización de texto: messages/

Para desplegar el portal en el servidor basta con copiar el fichero ``portal.war`` en ``/var/tomcat/webapps/portal.war``.

Una vez copiado, si Tomcat está arrancado y funcionando, el portal se desplegará de manera automática en unos instantes.

En el caso de que se quiera **actualizar** el portal con una nueva versión, bastará con sobreescribir el fichero
``/var/tomcat/webapps/portal.war`` con la nueva versión. De nuevo, si Tomcat está arrancado y funcionando, el portal
se actualizará automáticamente en unos instantes.

PostgreSQL
-----------

Se instalan dos bases de datos. La primera de ellas es "app" y contiene los datos de configuración del portal. Está en desuso actualmente ya que toda la configuración se almacena en /var/portal.

La segunda es "geoserverdata" ("geoserver" en versiones anteriores) y contiene los datos que se desean publicar.

* Base de datos portal: app (en desuso actualmente)
* Base de datos geoserver: geoserverdata

Se configuran los usuarios "app" y "geoserver" para acceder a las bases de datos "app" y "geoserverdata" respectivamente.

