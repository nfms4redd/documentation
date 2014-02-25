===========================
*Scripts* de administración
===========================

Los *scripts* de administración se ejecutan desde la línea de comandos y sirven para:

* Cargar ficheros *.shp* como tablas en PostGIS.
* Añadir espacios de trabajo, almacenes de datos y capas en GeoServer, a partir de bases de datos PostGIS.
* Administrar el fichero *layers.json* de configuración del portal.

En este taller veremos cómo instalar los *scripts*, una visión general de los comandos, un ejemplo del flujo de trabajo más común y, por último, una referencia de todos los *scripts*.

Instalación
-----------

Para instalar los *scripts* de administración de forma que se puedan ejecutar desde cualquier directorio, únicamente hay que copiarlos en */usr/bin*::

	$ sudo cp *.sh *.py /usr/bin

Para comprobar que se han instalado correctamente, se puede ejecutar el siguiente comando::

	$ portal-layer-tree.py --help

Si se muestra el mensaje de ayuda, los scripts se han instalado correctamente.


*Scripts*
---------

En primer lugar, todos los comandos aceptan la opción ``--help``. Esta opción muestra un mensaje con una descripción del comando y qué opciones acepta. Así, cualquiera de los comandos disponibles que se explican aquí, se puede ejecutar con la opción ``--help`` para ver su descripción y sus opciones.

Los *scripts* se pueden dividir en dos grupos: los *scripts* de *bash* (acabados en *.sh*) y los *scripts* de *Python* (comienzan con *portal-* y terminan en *.py*).

Los *scripts* de *bash* se utilizan para administrar las bases de datos PostGIS y los recursos de GeoServer. Estos scripts, a su vez, se pueden dividir en dos grupos: los scripts que actúan sobre PostGIS:

* pg-load.sh
* multi-pg-load.sh

y los que actúan sobre GeoServer:

* add-all-layers.sh 
* add-datastore.sh
* add-layer.sh
* add-workspace.sh
* multi-add-layer.sh

Es importante destacar que todos los *scripts* de *bash* tienen configurados por defecto los parámetros de conexión de la base de datos (*host*, puerto, esquema y nombre de base de datos) así como la configuración de GeoServer (espacio de trabajo y almacén de datos). En caso de omitir esas opciones al ejecutar los *scripts*, se tomarán esos valores por defecto.

Por su parte, los *scripts* de *Python* se utilizan exclusivamente para administrar el fichero *layers.json* de configuración del portal. Esto es así por simplicidad, ya que el manejo de ficheros *JSON* es mucho más simple con *Python* que con *bash*:

* portal-add-group.py
* portal-add-layer.py
* portal-layer-tree.py
* portal-rm-layer.py
* portal-set-group.py
* portal-set-layer.py

Ejemplo
-------

*Scripts* de *bash*
...................

En primer lugar, ya que la base de datos de PostGIS está vacía, hay que cargar ficheros *.shp*::

	$ pg-load.sh --crs 4326 --file <fichero_shp>

También es posible añadir todos los ficheros *.shp* de un directorio::

	$ multi-pg-load.sh --crs 4326 --folder <directorio>

Una vez se han cargado las capas en PostGIS, hay que añadirlas en GeoServer. Para esto, primero necesitamos crear un espacio de trabajo en GeoServer::

	$ add-workspace.sh

y un almacén de datos a partir de la base de datos PostGIS::

	$ add-datastore.sh

Una vez tenemos los datos cargados en PostGIS y GeoServer preparado, podemos añadir las tablas de PostGIS a GeoServer una a una::

	$ add-layer.sh --layer <nombre_de_la_tabla>

*NOTA*: Es posible que cuando se ejecute este comando se obtenga un error como este::

    ERROR cargando capa '<layer_name>' (code 400): Trying to create new feature type inside the store, but no attributes were specified

Este mensaje dice que la capa no existe en PostGIS. Esto puede ser porque PostGIS distingue mayúsculas y minúsculas para los nombres de la tabla. En caso de obtener este mensaje, se aconseja revisar en detalle el esquema, la base de datos y el nombre de la tabla.

También es posible añadir varias tablas de manera interactiva::

	$ multi-add-layer.sh 

Este comando simplemente queda a la espera de que el usuario escriba el nombre de la tabla y pulse *Intro* tantas veces como necesite. Para terminar de añadir tablas es necesario pulsar *Ctrl + D*.

Por último, es posible añadir de una vez todas las tablas de una base de datos a GeoServer::

	$ add-all-layers.sh

*Scripts* de *Python*
.....................

En lo que respecta a los *scripts* para administrar el fichero *layers.json*, lo primero que se puede hacer es mostrar el árbol de capas contenido en el fichero::

	$ portal-layer-tree.py

Posteriormente se pueden añadir grupos::

	$ portal-add-group.py --id g1 --label base --parent root

y capas::

	$ portal-add-layer.py --id layer1 --url <ruta_al_wms_de_geoserver> --wmsname <nombre_del_wms> --label mi_capa --group g1

También es posible modificar grupos y capas que ya existan::

	$ portal-set-group.py --id g1 --label admin
	$ portal-set-layer.py --id layer1 --label mi_otra_capa

o eliminar capas::

	$ portal-rm-layer.py --id layer1

Ayuda de los *scripts*
----------------------

Todos los scripts admiten un mayor nivel de configuración, pudiendo especificar el esquema o el nombre la base de datos, el espacio de trabajo, etc. Todo esto se puede consultar con la opción ``--help`` de cada uno de los comandos.
