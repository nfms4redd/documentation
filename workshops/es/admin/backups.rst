Copias de seguridad
=====================

.. note::

	=================  ================================================
	Fecha              Autores
	=================  ================================================             
	10 Octubre 2014		* Fernando González (fernando.gonzalez@fao.org)
	=================  ================================================	

	©2013 FAO Forestry 
	
	Excepto donde quede reflejado de otra manera, la presente documentación se halla bajo licencia : Creative Commons (Creative Commons - Attribution - Share Alike: http://creativecommons.org/licenses/by-sa/3.0/deed.es)

PostgreSQL
-----------

Ver documentación GeoTalleres: :ref:`postgresql-backup`

GeoServer
----------

Ver documentación GeoTalleres, teniendo en cuenta que la instalación estándar del sistema establece ``/var/geoserver/data`` como directorio de datos de GeoServer: :ref:`geoserver-backup` 

Portal
-------

Las copias de seguridad de la configuración del portal son muy similares a las de GeoServer ya que la configuración está almacenada también en un directorio, generalmente ``/var/portal``.

.. warning ::

	Antes de comenzar conviene revisar los permisos del directorio ``/var/portal``, ya que el proceso se puede simplificar si dicho directorio pertenece al usuario administrador con el que vamos a realizar las siguientes operaciones. En cualquier caso, el directorio y todos sus ficheros deben estar accesibles en modo lectura para el usuario ``tomcat7``, que es el que ejecuta la Tomcat7 que contiene el portal.
	
	Ejecutando la siguiente instrucción podemos ver que el propietario del directorio del portal es ``root``::
	
		$ ls -l /var  
		nfms@nfms-server:/var/portal$ ls -l /var
		total 56
		drwxr-xr-x  9 tomcat7 tomcat7  4096 Oct  9 10:22 apache-tomcat-7.0.47
		drwxr-xr-x  2 root    root     4096 May 27 06:47 backups
		drwxr-xr-x 11 root    root     4096 May 27 06:46 cache
		drwxrwsrwt  2 root    whoopsie 4096 May 27 06:25 crash
		drwxr-xr-x  3 root    root     4096 Oct  9 09:15 geoserver
		drwxr-xr-x 36 root    root     4096 Jun 10 18:36 lib
		drwxrwsr-x  2 root    staff    4096 Aug 18  2013 local
		lrwxrwxrwx  1 root    root        9 Dec 23  2013 lock -> /run/lock
		drwxr-xr-x 12 root    root     4096 Oct  8 15:06 log
		drwxrwsr-x  2 root    mail     4096 Dec 23  2013 mail
		drwxr-xr-x  2 root    root     4096 Dec 23  2013 opt
		drwxr-xr-x  6 root    root     4096 Jun  6 16:40 portal
		lrwxrwxrwx  1 root    root        4 Oct  7 10:39 run -> /run
		drwxr-xr-x  5 root    root     4096 Dec 23  2013 spool
		drwxrwxrwt  2 root    root     4096 Aug 21 10:39 tmp
		lrwxrwxrwx  1 root    root       20 Dec 23  2013 tomcat -> apache-tomcat-7.0.47
		drwxr-xr-x  2 root    root     4096 Jan  9  2014 www
		
	Suponiendo que accedemos con el usuario ``nfms`` podemos cambiar el propietario con la siguiente instrucción::
	
		$ sudo chown -R nfms:nfms /var/portal
	
	Nótese que es necesario usar ``sudo`` para cambiar el propietario del directorio ya que no pertenece a ``nfms``. A partir de este momento ya pertenece a ``nfms`` y todas las operaciones siguientes pueden ser ejecutadas sin ``sudo``. Si volvemos a mostrar los propietarios veremos que ha cambiado::
	
		$ ls -l /var  
		nfms@nfms-server:/var/portal$ ls -l /var
		total 56
		drwxr-xr-x  9 tomcat7 tomcat7  4096 Oct  9 10:22 apache-tomcat-7.0.47
		drwxr-xr-x  2 root    root     4096 May 27 06:47 backups
		drwxr-xr-x 11 root    root     4096 May 27 06:46 cache
		drwxrwsrwt  2 root    whoopsie 4096 May 27 06:25 crash
		drwxr-xr-x  3 root    root     4096 Oct  9 09:15 geoserver
		drwxr-xr-x 36 root    root     4096 Jun 10 18:36 lib
		drwxrwsr-x  2 root    staff    4096 Aug 18  2013 local
		lrwxrwxrwx  1 root    root        9 Dec 23  2013 lock -> /run/lock
		drwxr-xr-x 12 root    root     4096 Oct  8 15:06 log
		drwxrwsr-x  2 root    mail     4096 Dec 23  2013 mail
		drwxr-xr-x  2 root    root     4096 Dec 23  2013 opt
		drwxr-xr-x  6 nfms    nfms     4096 Jun  6 16:40 portal
		lrwxrwxrwx  1 root    root        4 Oct  7 10:39 run -> /run
		drwxr-xr-x  5 root    root     4096 Dec 23  2013 spool
		drwxrwxrwt  2 root    root     4096 Aug 21 10:39 tmp
		lrwxrwxrwx  1 root    root       20 Dec 23  2013 tomcat -> apache-tomcat-7.0.47
		drwxr-xr-x  2 root    root     4096 Jan  9  2014 www
	
Así, para realizar una copia de seguridad, es necesario copiar este directorio, comprimido por comodidad y optimización de espacio, a algún lugar fuera del servidor. Los siguientes comandos crearían una copia de la configuración en el fichero ``/tmp/portal-backup.tgz``::

	$ cd /var/portal
	$ tar -czvf /tmp/portal-backup.tgz *

Nótese que el comando ``tar``, encargado de la compresión, se debe ejecutar en el directorio $GEOSERVER_DATA. Las opciones ``-czvf`` especificadas significan:

* c: crear
* z: comprimir en zip
* v: verbose, muestra por pantalla los ficheros que se incluyen en la copia de seguridad
* f: fichero resultante, especificado a continuación

.. warning :: Es muy importante guardar los ficheros con la copia de seguridad en una máquina distinta al servidor que alberga el portal, ya que en caso de que haya algún problema con dicha máquina se pueden perder también las copias. 

Para recuperar la configuración sólo tenemos que reemplazar el directorio ``/var/portal`` por los contenidos del fichero que contiene la copia. Para ello se puede descomprimir la copia de seguridad en un directorio temporal::

	$ mkdir /tmp/copia
	$ tar -xzvf /tmp/portal-backup.tgz --directory=/tmp/copia

A diferencia del comando ``tar`` que utilizamos para crear la copia de seguridad, ahora estamos usando la opción ``x`` (extraer) en lugar de ``c`` (crear) y estamos especificando con la opción ``--directory`` que queremos extraer la copia en el directorio ``/tmp/copia``.

Una vez descomprimido sólo hay que reemplazar los contenidos del directorio ``/var/portal`` por los del directorio ``/tmp/copia``. Por seguridad, moveremos los contenidos actuales a otro directorio temporal::

	$ mkdir /tmp/portal_actual
	$ mv /var/portal/* /tmp/portal_actual/

Tras estas dos instrucciones el directorio /var/portal estará vacío y tendremos los contenidos actuales en ``/tmp/portal_actual/`` y la copia en ``/tmp/copia``. Por tanto, sólo tenemos que copiar los contenidos de ``/tmp/copia`` a ``/var/portal``::

	$ cp -R /tmp/copia/* /var/portal

Por último, quedaría reiniciar el portal, que se ejecuta dentro de Tomcat7::
	
	$ sudo service tomcat7 restart

Versiones actuales del software
--------------------------------

Además de los directorios de configuración, es conveniente guardar una copia de los programas instalados, básicamente:

- Fichero WAR del portal.
- Scripts de administración.

La forma más sencilla es guardar una copia de los ficheros que se instalan y repetir la instalación de los mismos en caso necesario. 