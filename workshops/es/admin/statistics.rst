Estadísticas
=========================

El sistema de estadísticas consta de dos partes. Por una parte, el servicio de estadísticas nos permite mostrar al usuario gráficas sobre objetos existentes en el mapa. Por otra, el motor de cálculo nos permite generar los datos estadísticos de cobertura de forma automática.

Servicio de estadísticas
------------------------------

Este servicio nos permitirá obtener gráficos sobre objetos del mapa. Los datos a presentar en dichos gráficos pueden presentar una o más variables con datos en uno o más instantes temporales.

Para ello es necesario configurar dos tablas en la base de datos:

* Metadatos: tabla con la información sobre el gráfico: título, unidades, tipo de gráfico, nombre de la tabla de datos
* Datos: tabla con las magnitudes a presentar para cada serie en el gráfico

Configuración de la tabla de metadatos
------------------------------------------

La tabla de metadatos se deberá crear en un esquema específico mediante la siguiente instrucción:

.. code-block:: sql

	CREATE TABLE mi_schema.redd_stats_metadata (
		id serial NOT NULL,
		title character varying,
		subtitle character varying,
		description character varying,
		y_label character varying,
		units character varying,
		tooltipsdecimals integer,
		layer_name character varying,
		table_name_division character varying,
		division_field_id character varying,
		class_table_name character varying,
		class_field_name character varying,
		date_field_name character varying,
		table_name_data character varying,
		graphic_type character varying,
		CONSTRAINT indicators_metadata_pkey PRIMARY KEY (id)
	) WITH ( OIDS=FALSE )

Cada fila de esta tabla especificará un tipo de gráfico para los objetos de una tabla del portal. Los campos necesarios para esto son:

- id: identificador, rellenado automáticamente.
- title: título del gráfico como se mostrará en el portal
- subtitle: subtítulo del gráfico como se mostrará en el portal
- description: descripción del gráfico, actualmente sin uso
- y_label: nombre de la magnitud medida para cada serie, por ejemplo "superficie"
- units: unidades en las que se mide la magnitud, por ejemplo "Hectáreas"
- tooltipsdecimals: Número de decimales que se presentarán cuando el usuario interactúa con la gráfica
- layer_name: Nombre en GeoServer de la capa para la que se presentarán las estadísticas, con la forma espaciodetrabajo:nombrecapa. Por ejemplo: bosques:provincias
- division_field_id: Nombre del campo como lo sirve GeoServer que identifica los objetos en la capa anterior. Es posible utilizar un campo que no es único si se desea tener el mismo gráfico para más de un objeto.
- table_name_data: Nombre de la tabla que contiene los datos a presentar.
- graphic_type: Tipo de gráfico. Puede ser 2D o 3D.

Configuración de la tabla de datos
-----------------------------------

Cada registro de la tabla de metadatos requiere una tabla con los datos de los gráficos que se llame como se especificó en el campo ``table_name_data`` de dicho registro.

Esta tabla presenta datos de una o más variables en uno o más instantes temporales. Para cada dato se creará un registro con los campos siguientes:

- division_id: Valor del campo ``division_field_id`` del registro de la tabla de metadatos que hace referencia a esta tabla.
- variable: Nombre de la variable a presentar, por ejemplo ``bosque nativo``.
- valor: Magnitud presentada en el gráfico para la ``variable`` en el instante ``fecha``. 
- fecha: Fecha en la cual se da el ``valor`` de la ``variable``.

Para la creación se puede utilizar la siguiente plantilla:

.. code-block:: sql

	CREATE TABLE <esquema>.<nombre> (
		division_id varchar,
		variable varchar,
		valor real,
		fecha date
	);




Caso práctico
-----------------

En este ejemplo vamos a suponer que tenemos:

* Una tabla provincias con un campo ``id_provincia`` con tres provincias con identificador 1, 2 y 3.
* Una capa en GeoServer, publicando la tabla anterior con el nombre ``provincias`` en el espacio de trabajo ``bosques``, es decir, con nombre ``bosques:provincias``.
* La tabla convenientemente publicada en el portal, de manera es es posible mostrar el diálogo de información al pinchar en una de las provincias.

Queremos publicar los siguientes datos de cobertura forestal:

=================  ====== ====== ======
Provincia 1         1990   2000   2005 
=================  ====== ====== ======
bosque nativo        100     98     78 
bosque cultivado    1000   1100   1050 
=================  ====== ====== ======

=================  ====== ====== ======
Provincia 2         1990   2000   2005 
=================  ====== ====== ======
bosque nativo        590     ND    208 
bosque cultivado       0      0     50 
=================  ====== ====== ======

=================  ====== ====== ======
Provincia 3         1990   2000   2005 
=================  ====== ====== ======
bosque nativo       2000   2300   2500 
bosque cultivado       0    100     50 
=================  ====== ====== ======

Lo primero será crear la tabla de datos con cualquer nombre significativo, por ejemplo ``cobertura_forestal_provincias``. Suponemos que creamos todo en un esquema llamado estadísticas:

.. code-block:: sql

	CREATE TABLE estadisticas.cobertura_forestal_provincias(
		division_id varchar,
		variable varchar,
		valor real,
		fecha date
	);

Una vez la tabla está creada, es necesario introducir un registro por cada dato:

.. code-block:: sql

	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('1', 'bosque nativo', 100, '1/1/1990');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('1', 'bosque nativo', 98, '1/1/2000');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('1', 'bosque nativo', 78, '1/1/2005');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('1', 'bosque cultivado', 1000, '1/1/1990');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('1', 'bosque cultivado', 1100, '1/1/2000');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('1', 'bosque cultivado', 1050, '1/1/2005');

	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('2', 'bosque nativo', 590, '1/1/1990');
	-- Dato no disponible para 2000
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('2', 'bosque nativo', 208, '1/1/2005');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('2', 'bosque cultivado', 0, '1/1/1990');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('2', 'bosque cultivado', 0, '1/1/2000');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('2', 'bosque cultivado', 50, '1/1/2005');

	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('3', 'bosque nativo', 2000, '1/1/1990');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('3', 'bosque nativo', 2300, '1/1/2000');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('3', 'bosque nativo', 2500, '1/1/2005');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('3', 'bosque cultivado', 0, '1/1/1990');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('3', 'bosque cultivado', 100, '1/1/2000');
	INSERT INTO estadisticas.cobertura_forestal_provincias VALUES ('3', 'bosque cultivado', 50, '1/1/2005');

Por último crearemos el registro en la tabla de metadatos que enlaza estos datos con nuestra tabla de datos recién creada:

.. code-block:: sql

	INSERT INTO estadisticas.redd_stats_metadata (
		title,
		subtitle,
		y_label,
		units,
		tooltipsdecimals,
		layer_name,
		division_field_id,
		table_name_data,
		graphic_type
	) VALUES (
		'Cobertura forestal',
		'Evolución de la cobertura forestal por provincia',
		'Cobertura',
		'Hectáreas',
		2,
		'bosques:provincias',
		'id_provincia',
		'estadisticas.cobertura_forestal_provincias',
		'2D'
	);

Ahora, cuando el usuario pinche en una de las provincias:

#. el portal buscará en la tabla ``estadisticas.redd_stats_metadata`` los registros que afectan a la capa ``bosques:provincias`` y encontrará el registro que acabamos de introducir.
#. el portal ofrecerá al usuario un botón para mostrar los datos de la tabla de datos asociada ``estadisticas.cobertura_forestal_provincias``
#. el usuario pinchará en dicho botón
#. el portal leerá la tabla de datos y creará el gráfico que se ofrecerá al usuario

.. image:: _static/statistics.png
	:align: center
	:scale: 75%







