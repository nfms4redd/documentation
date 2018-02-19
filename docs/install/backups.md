> | Fecha           | Autores                                         |
> |-----------------|-------------------------------------------------|
> | 10 Octubre 2014 | Fernando González (<fernando.gonzalez@fao.org>) |
> | 9  Enero 2018   | Víctor González (<victor.gonzalez@fao.org>)     |
>
> ©2013 FAO Forestry
>
> Excepto donde quede reflejado de otra manera, la presente documentación se halla bajo licencia [Creative Commons](http://creativecommons.org/licenses/by-sa/3.0/deed.es).

## PostgreSQL

Ver documentación en [GeoTalleres](https://geotalleres.readthedocs.io/es/latest/postgresql/postgresql.html#creacion-de-copias-de-seguridad).

## GeoServer

Ver documentación en [GeoTalleres](https://geotalleres.readthedocs.io/es/latest/geoserver-backup/geoserver_backup.html), teniendo en cuenta que la instalación estándar del sistema establece ``/var/nfms/geoserver`` como directorio de datos de GeoServer.

## Portal

Las copias de seguridad de la configuración del portal son muy similares a las de GeoServer ya que la configuración está almacenada también en un directorio, generalmente `/var/nfms/geoladris`.

Además, es conveniente guardar una copia del fichero `.war` del portal, de forma que se pueda repetir la instalación utilizando exactamente el mismo software en caso necesario.


Para realizar una copia de seguridad, es necesario copiar este directorio, comprimido por comodidad y optimización de espacio, a algún lugar fuera del servidor. Los siguientes comandos crearían una copia de la configuración en el fichero `/tmp/portal-backup.tar.gz`:

```bash
cd /var/nfms/geoladris
tar -czvf /tmp/portal-backup.tar.gz *
```

Las opciones ``-czvf`` especificadas significan:

* c: crear
* z: comprimir en zip
* v: verbose, muestra por pantalla los ficheros que se incluyen en la copia de seguridad
* f: fichero resultante, especificado a continuación

> **IMPORTANTE**: Se deben guardar los ficheros con la copia de seguridad en una máquina distinta al servidor que alberga el portal, ya que en caso de que haya algún problema con dicha máquina se pueden perder también las copias.

Para recuperar la configuración sólo tenemos que reemplazar el directorio `/var/nfms/geoladris` por los contenidos del fichero que contiene la copia. Para ello se puede descomprimir la copia de seguridad en un directorio temporal:

```bash
mkdir /tmp/copia
tar -xzvf /tmp/portal-backup.tgz --directory=/tmp/copia
```

A diferencia del comando `tar` que utilizamos para crear la copia de seguridad, ahora estamos usando la opción `x` (extraer) en lugar de `c` (crear) y estamos especificando con la opción `--directory` que queremos extraer la copia en el directorio `/tmp/copia`.

Una vez descomprimido sólo hay que reemplazar los contenidos del directorio `/var/nfms/geoladris` por los del directorio `/tmp/copia`. Por seguridad, mantendremos los contenidos anteriores en `/tmp`:

```bash
sudo mv /var/nfms/geoladris /tmp/geoladris.bak
sudo mv /tmp/copia /var/nfms/geoladris
```

Por último quedaría reiniciar el portal:

```bash
cd /var/nfms
docker-compose restart portal
```

o, si se ha instalado mediante paquetes:

```bash
sudo service tomcat7 restart
```
