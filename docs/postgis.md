> | Fecha         | Autores                                         |
> |---------------|-------------------------------------------------|
> | 9  Enero 2018 | Víctor González (<victor.gonzalez@fao.org>)  |
> | 15 Enero 2018 | Micho García (<micho.garcia@fao.org>) |
>
> ©2013 FAO Forestry
>
> Excepto donde quede reflejado de otra manera, la presente documentación se halla bajo licencia [Creative Commons](http://creativecommons.org/licenses/by-sa/3.0/deed.es).

*Enlaces a geotalleres*

## Configuración inicial

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