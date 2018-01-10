Para la instalación de todo el sistema se asume la utilización de un servidor con Linux. En caso de no estar familiarizado con este sistema operativo, se recomienda leer antes una [introducción](https://geotalleres.readthedocs.io/es/latest/linux/linux.html).

> **NOTA**: Esta guía se ha realizado utilizando Ubuntu 16.04 (Xenial).

## Instalación

Para instalar PostgreSQL/PostGIS bastará con ejecutar:

```bash
apt update
apt install -y postgresql postgis
```

Una vez la instalación ha terminado habrá que configurar el acceso desde el exterior de la máquina. Para ello editaremos el fichero `/etc/postgresql/<version>/main/postgresql.conf` y reemplazaremos la línea:

```
#listen_addresses = 'localhost'
```

con:

```
listen_addresses = '*'
```

Esto sirve para que PostgreSQL acepte conexiones de cualquier máquina.

Posteriormente añadiremos esto al final del fichero `/etc/postgresql/<version>/main/pg_hba.conf`:

```
host    all             all             0.0.0.0/0               md5
```

que sirve para poder hacer login en la base de datos utilizando usuario y contraseña desde cualquier máquina.

Por último arrancaremos el servicio:

```bash
systemctl enable postgresql
service postgresql start
```

## Configuración

Una vez el servicio está funcionando, crearemos una nueva base de datos:

```bash
sudo -u postgres createdb nfms
```

y conectaremos a ella:

```bash
sudo -u postgres psql -d nfms
```

Estando conectados deberemos activar PostGIS en nuestra base de datos:

```bash
CREATE EXTENSION postgis;
```

y crear dos usuarios, uno para administración y otro sólo para lectura (**¡es importante cambiar las contraseñas por otras más seguras!**):

```bash
CREATE ROLE admin WITH LOGIN CREATEROLE PASSWORD 'admin';
CREATE ROLE readonly WITH LOGIN PASSWORD 'readonly';
```

Por último, crearemos el esquema que contendrá nuestros datos espaciales:

```bash
CREATE SCHEMA spatial AUTHORIZATION admin;
```

Para salir de la conexión a la base de datos basta con escribir `\q`.

A partir de ahora se debería poder conectar a la base de datos sin problemas desde QGIS o pgAdmin.