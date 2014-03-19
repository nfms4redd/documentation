===========================
*Scripts* de administración
===========================

.. note::

	=================  ================================================
	Fecha              Autores
	=================  ================================================             
	19 Marzo 2014		* Fernando González (fernando.gonzalez@fao.org)
	19 Marzo 2014		* Víctor González (victor.gonzalez@geomati.co)
	=================  ================================================	

	©2014 FAO Forestry
	
	Excepto donde quede reflejado de otra manera, la presente documentación se halla bajo licencia : Creative Commons (Creative Commons - Attribution - Share Alike: http://creativecommons.org/licenses/by-sa/3.0/deed.es)

Los *scripts* de administración se ejecutan desde la línea de comandos y sirven para:

* Cargar ficheros *.shp* como tablas en PostGIS.
* Añadir espacios de trabajo, almacenes de datos y capas en GeoServer, a partir de bases de datos PostGIS.
* Administrar el fichero *layers.json* de configuración del portal.

En este taller veremos cómo instalar los *scripts*, una descripción de los *scripts* y un ejemplo del flujo de trabajo más común.

Instalación
-----------

Para instalar los *scripts* de administración de forma que se puedan ejecutar desde cualquier directorio, únicamente hay que copiarlos en */usr/bin*::

	$ sudo cp *.sh *.py /usr/bin

Para comprobar que se han instalado correctamente, se puede ejecutar el siguiente comando::

	$ portal-layer-tree.py --help

Si se muestra el mensaje de ayuda, los scripts se han instalado correctamente.


*Scripts*
---------

Ayuda
.....

En primer lugar, todos los comandos aceptan la opción ``--help``. Esta opción muestra un mensaje con una descripción del comando y qué opciones acepta. Así, cualquiera de los comandos disponibles que se explican aquí, se puede ejecutar con la opción ``--help`` para ver su descripción y sus opciones. Este mensaje de ayuda tiene la siguiente forma::

	<modo de uso>

	<descripción del comando>

	Opciones:
		<opción 1>		<descripción de la opción 1>
		<opción 2>		<descripción de la opción 2>
		...

Por ejemplo, si se ejecuta el comando ``pg-load.sh --help`` se obtiene el siguiente resultado::
	
	uso: pg-load.sh --crs CRS [--schema SCHEMA] [--database DATABASE] 
			[--encoding ENCODING] --file FILE

	Carga un fichero .shp como una tabla de PostGIS.

	Opciones:
		--crs		Sistema de coordenadas del fichero .shp
		--schema	Esquema donde se añadirá la nueva tabla. Valor por defecto: nfms
		--database	Base de datos que contiene al esquema donde se añadirá la nueva tabla. Valor por defecto: geoserverdata
		--encoding	Codificación de caracteres del fichero .dbf. Valor por defecto: UTF8
		--file		Fichero .shp a añadir
	
donde se puede observar que la descripción del comando es *"Carga un fichero .shp como una tabla de PostGIS"* y que acepta las opciones ``--crs``, ``--schema``, ``--database``, ``--encoding`` y ``--file``, cada una con su correspondiente descripción. Además, es importante fijarse en el modo de uso::

	uso: pg-load.sh --crs CRS [--schema SCHEMA] [--database DATABASE] 
			[--encoding ENCODING] --file FILE

Es aquí donde se puede averiguar qué opciones son obligatorias y cuáles son opcionales. Las opcionales se muestran entre corchetes, mientras que las que son obligatoras no llevan corchetes. Así, vemos que para este *script*, ``--crs`` y ``--file`` son obligatorias, mientras que ``--schema``, ``--database`` y ``--encoding`` son opcionales.

Descripción
...........

Los *scripts* se pueden dividir en dos grupos: los *scripts* de *bash* (acabados en *.sh*) y los *scripts* de *Python* (comienzan con *portal-* y terminan en *.py*).

Los *scripts* de *bash* se utilizan para administrar las bases de datos PostGIS y los recursos de GeoServer. Estos *scripts*, a su vez, se pueden dividir en dos grupos. Por un lado los scripts que actúan sobre PostGIS:

* ``pg-load.sh``: Este comando sirve para cargar un fichero *.shp* como una tabla en PostGIS.
* ``multi-pg-load.sh``: Sirve para cargar todos los ficheros *.shp* de un directorio como diferentes tablas en PostGIS. Es muy útil cuando se quieren añadir muchos datos de una vez, por ejemplo, la primera vez que se despliega el portal de diseminación. **IMPORTANTE**: para utilizar este comando, todos los ficheros *.shp* deben estar en el mismo sistema de coordenadas.

Y por otro lado los que actúan sobre GeoServer:

* ``add-layer.sh``: Sirve para añadir una nueva capa a GeoServer a partir de una tabla de PostGIS. Es posible que cuando se ejecute este comando se obtenga un error como este: ``ERROR cargando capa '<layer_name>' (code 400): Trying to create new feature type inside the store, but no attributes were specified``. Este mensaje dice que la capa no existe en PostGIS. Esto puede ser porque PostGIS distingue mayúsculas y minúsculas para los nombres de la tabla. En caso de obtener este mensaje, se aconseja revisar en detalle el esquema, la base de datos y el nombre de la tabla.

* ``multi-add-layer.sh``: Sirve para añadir varias capas a GeoServer a partir de diferentes tablas de PostGIS. Se puede utilizar en lugar de ejecutar varios comandos ``add-layer.sh`` seguidos para acelerar el proceso.
* ``add-all-layers.sh``: Sirve para añadir a GeoServer todas las tablas de un esquema de base de datos de PostGIS. Este comando se puede utilizar cuando se han  cargado por primera vez todos los datos en PostGIS y ninguna de las tablas está añadida todavía.

Es importante destacar que todos los *scripts* de *bash* tienen configurados por defecto los parámetros de conexión de la base de datos (*host*, puerto, esquema y nombre de base de datos) así como la configuración de GeoServer (espacio de trabajo y almacén de datos). En caso de omitir esas opciones al ejecutar los *scripts*, se tomarán esos valores por defecto. Para saber cuáles son los valores por defecto, simplemente basta con mostrar la ayuda del comando con la opción ``--help``. Por ejemplo, para ver qué valores por defecto se toman para el comando ``add-layer.sh``, podemos mostrar su ayuda::

	uso: add-layer.sh --layer LAYER [--workspace WORKSPACE] [--datastore DATASTORE]

	Añade una nueva capa a GeoServer a partir de una tabla de PostGIS.
	El esquema que contiene la tabla debe haber sido añadido anteriormente a GeoServer como un datastore.

	Opciones:
		--layer		Tabla que se añadirá a GeoServer.
		--workspace	Espacio de trabajo de GeoServer que donde se añadirá la capa. Valor por defecto: nfms
		--datastore	Nombre del almacén de datos que contiene la tabla a añadir. Valor por defecto: geoserverdata
	
En ella podemos observar que el valor por defecto para el *workspace* es *nfms*, mientras que para el *datastore* es *geoserverdata*. En el caso de *layer* no se muestra ningún valor por defecto. Esto simplemente quiere decir que no existe un valor por defecto para esa opción. Nótese que ``--layer`` es obligatorio (no lleva corchetes en la descripción de uso).

Por su parte, los *scripts* de *Python* se utilizan exclusivamente para administrar el fichero *layers.json* de configuración del portal. Esto es así por simplicidad, ya que el manejo de ficheros *JSON* es mucho más simple con *Python* que con *bash*. El *script* de *Python* más sencillo es el que muestra el árbol de capas, ``portal-layer-tree.py``::

	$ portal-layer-tree.py
	LAYER TREE
	==========
	root
		base
			innerbase
				blue-marble (blue-marble)
			innerforest
				forestClassification (forestClassification)
		admin
			countryBoundaries (countryBoundaries)
			provinces (provinces)
		landcover
			forest_mask (forest_mask)

	MAP LAYER ORDER
	===============
	1. provinces
	2. countryBoundaries
	3. forest_mask
	4. forestClassification
	5. blue-marble

Como vemos, el árbol de capas tiene tres grupos *base*, *admin* y *landcover*. Es importante destacar que estos grupos tienen como padre a *root* que es el grupo que contiene todo, pero que no se mostrará en el portal. Cada grupo a su vez puede contener grupos, como *base*, que contiene *innerbase* y *innerforest*. Por último, los grupos contienen capas, que se muestran de la siguiente forma::

	<capa_de_portal> (<capa_de_mapa 1>, <capa_de_mapa 2>, ...)

De esta manera es fácil distinguir las capas de portal de los grupos porque las capas siempre son las hojas del árbol y llevan las capas de mapa especificadas entre paréntesis.

Además, el script ``portal-layer-tree.py`` muestra el orden de las capas tal y como se mostrarán en el mapa. Así, en el ejemplo anterior la capa de provincias (*provinces*) se mostrará por encima de todas las demás, mientras que la capa base *blue-marble* estará debajo de todas las demás.

Por otro lado, existen *scripts* para gestionar los grupos de capas:

* ``portal-add-group.py``: Añade un grupo vacío al árbol de capas del portal.
* ``portal-set-group.py``: Modifica un grupo del árbol de capas. Con este *script* se puede modificar el nombre del grupo o moverlo a otro grupo.
* ``portal-rm-group.py``: Elimina un grupo **vacío** del árbol de capas.

También existen *scripts* para las capas del portal:

* ``portal-add-layer.py``: Añade una nueva capa al árbol de capas del portal.
* ``portal-rm-layer.py``: Eliminar una capa del árbol de capas del portal.
* ``portal-set-layer.py``: Modifica una capa. Este script es el más complejo de todos y acepta muchas opciones, todas ellas especificadas con detalle en la ayuda del *script*.

Avanzado
........

Por último, existen ciertos casos avanzados en los que se desea asociar más de una capa de mapa a una misma capa de portal. Esto puede ser útil, por ejemplo, para tener una capa de mapa que se dibuja mientras que otra, más simple, está oculta y se utiliza para realizar peticiones. Para estos casos, es posible gestionar las capas de mapa a nivel individual con los siguientes *scripts*:

* ``portal-add-map-layer``: Añade una nueva capa de mapa, asociándola con una capa de portal.
* ``portal-rm-map-layer``: Eliminar una capa de mapa. Es necesario que la capa de portal asociada tenga más de una capa de mapa, ya que de lo contrario la capa de portal se quedaría sin ninguna capa de mapa.
* ``portal-set-map-layer``: Modifica los valores de una capa de mapa. En el caso de que existan varias capas de mapa para una misma capa de portal, se ha de poder modificar una capa de mapa individualmente. En caso contrario (una única capa de mapa para una capa de portal), esta funcionalidad también está disponible con el *script* ``portal-set-layer.py``.

Ejemplo
-------

Carga de datos
..............

En primer lugar, ya que la base de datos de PostGIS está vacía, hay que cargar ficheros *.shp*::

	$ pg-load.sh --crs 4326 --file <fichero_shp>

En el caso de no especificar alguno de las opciones obligatorias, como en este caso ``--crs`` o ``--file``, se mostraría un mensaje de error como el siguiente::

	El sistema de referencia de coordenadas del fichero debe ser especificado. Ejemplo: --crs 4326
	
En el caso de que haya que añadir todos los ficheros *.shp* de un directorio, es posible agilizar el proceso utilizando con el siguiente comando. Hay que recordar que es necesario que todos los ficheros *.shp* del directorio deben de estar en el mismo sistema de coordenadas::

	$ multi-pg-load.sh --crs 4326 --folder <directorio>

Una vez se han cargado las capas en PostGIS, hay que añadirlas en GeoServer. En este punto, asumiremos que ya existe en GeoServer un espacio de trabajo y el almacén de datos correspondiente a la base de datos. Llegados a este punto podemos añadir las tablas de PostGIS a GeoServer una a una::

	$ add-layer.sh --layer <nombre_de_la_tabla> --workspace <workspace> --datastore <datastore>

Como se ha comentado anteriormente, en el caso de que el *workspace* sea *nfms* y el *datastore* sea *geoserverdata* es posible omitir esas opciones para utilizar los valores por defecto::

	$ add-layer.sh --layer <nombre_de_la_tabla>

También es posible añadir varias tablas de manera interactiva::

	$ multi-add-layer.sh 

Este comando simplemente queda a la espera de que el usuario escriba el nombre de la tabla y pulse *Intro* tantas veces como necesite. Para terminar de añadir tablas es necesario pulsar *Ctrl + D*.

Además de introducir las tablas de manera interactiva, es posible también añadir con un único comando todas las tablas de una base de datos a GeoServer::

	$ add-all-layers.sh

Configuración del portal
........................

Una vez se han añadido los datos que necesitamos a la base de datos y GeoServer, podemos pasar a administrar las capas del portal. El caso más común es que ya exista un árbol de capas, bien porque sea el que viene por defecto como ejemplo cuando se despliega el portal, o bien porque esté ahí de una instalación anterior.

En cualquier caso, lo primero que haremos será mostrarlo para ver en qué estado tenemos las capas y grupos de nuestro portal. Esto lo haremos con el comando ``portal-layer-tree.py``::

	$ portal-layer-tree.py
	LAYER TREE
	==========
	root
		base
			innerbase
				blue-marble (blue-marble)
			innerforest
				forestClassification (forestClassification)
		admin
			countryBoundaries (countryBoundaries)
			provinces (provinces)
		landcover
			forest_mask (forest_mask)


	MAP LAYER ORDER
	===============
	1. provinces
	2. countryBoundaries
	3. forest_mask
	4. forestClassification
	5. blue-marble

Para este ejemplo supondremos que la única capa que nos es útil es *blue-marble* y que la queremos en el grupo *base*. Así que lo primero que haremos será eliminar todas las demás con el comando ``portal-rm-layer.py`` y volver a mostrar el árbol de capas::

	$ portal-rm-layer.py --id forestClassification
	$ portal-rm-layer.py --id countryBoundaries
	$ portal-rm-layer.py --id provinces
	$ portal-rm-layer.py --id forest_masl
	$ portal-layer-tree.py
	LAYER TREE
	==========
	root
		base
			innerbase
				blue-marble (blue-marble)
			innerforest
		admin
		landcover


	MAP LAYER ORDER
	===============
	1. blue-marble

Como podemos observar, al eliminar las capas se han quedado grupos vacíos que no vamos a necesitar. Estos grupos los eliminaremos con ``portal-rm-group.py``::

	$ portal-rm-group.py --id innerforest
	$ portal-rm-group.py --id admin
	$ portal-rm-group.py --id landcover
	$ portal-layer-tree.py
	LAYER TREE
	==========
	root
		base
			innerbase
				blue-marble (blue-marble)


	MAP LAYER ORDER
	===============
	1. blue-marble

Ahora podemos mover la capa *blue-marble* al grupo *base* y eliminar el grupo *innerbase*. Puesto que en este caso estamos modificando la capa (el grupo al que pertenece), utilizaremos el comando ``portal-set-layer.py``::

	$ portal-set-layer.py --id blue-marble --group base
	$ portal-rm-group.py --id innerbase
	$ portal-layer-tree.py
	LAYER TREE
	==========
	root
		base
			blue-marble (blue-marble)


	MAP LAYER ORDER
	===============
	1. blue-marble

Ahora que ya tenemos únicamente una capa base en el grupo que queríamos, podemos empezar a añadir nuevos grupos y capas para los datos que tenemos. Para empezar añadiremos dos grupos, uno para divisiones territoriales (*territoriales*) y otro para datos forestales (*forestales*). Esto lo haremos con el *script* ``portal-add-group.py``::

	$ portal-add-group.py --id territoriales --parent root --label "Divisiones territoriales"
	$ portal-add-group.py --id forestales --parent root --label "Datos forestales"
	$ portal-layer-tree.py --id
	LAYER TREE
	==========
	root
		base
			blue-marble (blue-marble)
		territoriales
		forestales


	MAP LAYER ORDER
	===============
	1. blue-marble

Por último, podemos añadir capas a los grupos. Supondremos que anteriormente hemos añadido tres capas a GeoServer, dos con divisiones territoriales (provincias y municipios) y otro con datos de cobertura forestal. Añadiremos estas capas con ``portal-add-layer.py``::

	$ portal-add-layer.py --id provincias --url <url> --wmsName provincias --label "Provincias" --group territoriales
	$ portal-add-layer.py --id municipios --url <url> --wmsName municipios --label "Municipios" --group territoriales
	$ portal-add-layer.py --id cobertura --url <url> --wmsName cobertura --label "Cobertura forestal" --group forestales
	$ portal-layer-tree.py
	LAYER TREE
	==========
	root
		base
			blue-marble (blue-marble)
		territoriales
			provincias (map-provincias)
			municipios (map-municipios)
		forestales
			cobertura (map-cobertura)


	MAP LAYER ORDER
	===============
	1. map-cobertura
	2. map-municipios
	3. map-provincias
	4. blue-marble

donde *<url>* es la URL del servicio WMS. Esta URL puede ser la URL de GeoServer en nuestro servidor (por ejemplo, ``http://<servidor>/geoserver/nfms/wms``) o la URL de un servicio WMS externo.

Además, es importante destacar que cuando se añade una capa, se añade tanto una capa para el portal que se mostrará en el árbol de capas, como una capa para el mapa. Como se ha comentado anteriormente, las capas de portal van seguidas de las capas de mapa entre paréntesis. Además, para distinguirlas todavía más fácilmente, las nuevas capas del mapa se crean con el prefijo *map-*, como se puede ver arriba.

En este punto podemos querer cambiar el orden en que se mostrarán las capas. Por ejemplo, para hacer que la capa de provincias se muestre por encima de la de municipios podemos utilizar el comando ``portal-set-map-layer.py``::

	$ portal-set-map-layer.py --id map-provincias --order 2
	$ portal-layer-tree.py
	LAYER TREE
	==========
	root
		base
			blue-marble (blue-marble)
		territoriales
			provincias (map-provincias)
			municipios (map-municipios)
		forestales
			cobertura (map-cobertura)


	MAP LAYER ORDER
	===============
	1. map-cobertura
	2. map-provincias
	3. map-municipios
	4. blue-marble

Existen muchos más parámetros que se pueden configurar o cambiar tanto para las capas como para los grupos. Para ello podemos utilizar los *scripts* ``portal-set-group.py``, ``portal-set-layer.py`` y ``portal-set-map-layer.py``. Se recomienda ejecutar todos ellos con la opción ``--help`` para ver qué opciones admite y cómo utilizarlos.

