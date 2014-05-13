Copias de seguridad
=====================

PostgreSQL
-----------

Backup
.......

pg_dump --username=geoserver --format=c --schema=gis --file=/tmp/dump.backup geoserverdata

A tener en cuenta:

- geoserverdata es el nombre de la base de datos que queremos exportar

- --format=c Es el formato "custom", binario y comprimido

- "gis" es el esquema donde están todos nuestros datos

- El fichero resultante (/tmp/dump.backup) ha de almacenarse en un lugar seguro. Concretamente, el directorio ``/tmp/`` se elimina cada vez que el servidor se reinicia por lo que sólo puede utilizarse como almacenamiento temporal para inmediatamente mover el backup a un lugar más seguro.


Recuperación del backup
.........................

1) Eliminamos el esquema

psql -d geoserverdata -U geoserver -c "drop schema gis cascade"

2) Restauramos el esquema desde la copia de seguridad

pg_restore --dbname geoserverdata --username=geoserver /tmp/dump.backup

A tener en cuenta:

El esquema público no se modifica en esta operación, por lo que PostGIS sigue instalado y no es necesario ejecutar "create extension postgis" de nuevo. Si elimináramos la base de datos completamente (y no sólo uno de los esquemas, como en este caso) estaremos obligados a instalar PostGIS de nuevo antes de recuperar el backup.

