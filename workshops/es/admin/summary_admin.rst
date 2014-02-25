Resumen administración
=========================

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

PostgreSQL
-----------

Se instalan dos bases de datos. La primera de ellas es "app" y contiene los datos de configuración del portal. Está en desuso actualmente ya que toda la configuración se almacena en /var/portal.

La segunda es "geoserverdata" ("geoserver" en versiones anteriores) y contiene los datos que se desean publicar.

* Base de datos portal: app (en desuso actualmente)
* Base de datos geoserver: geoserverdata

Se configuran los usuarios "app" y "geoserver" para acceder a las bases de datos "app" y "geoserverdata" respectivamente.

