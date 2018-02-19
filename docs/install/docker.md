> | Fecha         | Autores                                         |
> |---------------|-------------------------------------------------|
> | 9  Enero 2018 | Víctor González (<victor.gonzalez@fao.org>)  |
>
> ©2013 FAO Forestry
>
> Excepto donde quede reflejado de otra manera, la presente documentación se halla bajo licencia [Creative Commons](http://creativecommons.org/licenses/by-sa/3.0/deed.es).

La instalación con [Docker](https://www.docker.com) es muy sencilla y permite tener el sistema funcionando en muy pocos minutos.

Sin embargo, en algunos entornos no es posible utilizar Docker o la política de sistemas lo impide. En tal caso, es posible [instalar el sistema mediante paquetes](packages.md).

## Instalar Docker

En primer lugar, deberemos instalar [Docker](https://www.docker.com) y [docker-compose](https://docs.docker.com/compose/) en nuestro sistema.

Se pueden encontrar unas instrucciones detalladas (para [Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/) y [docker-compose](https://docs.docker.com/compose/install/) de la instalación en su web:

Para sistemas Ubuntu, existe un script que lo instala automáticamente. Basta con descargarlo y ejecutarlo:

```bash
wget https://nfms4redd.github.io/documentation/install/docker/install.sh
chmod +x install.sh
sudo ./install.sh
```

Para comprobar que se ha instalado correctamente podemos ejecutar:

```bash
docker --version
docker-compose --version
```

## Arrancar el sistema NFMS

Para arrancar el sistema NFMS con todos sus componentes basta con descargarse el script de arranque y ejecutarlo:

```bash
wget https://nfms4redd.github.io/documentation/install/docker/setup.sh
chmod +x setup.sh
sudo ./setup.sh
```

> **IMPORTANTE**: Este script solo debe ejecutarse una vez. Para reiniciar los servicios habrá que utilizar el comando `docker-compose` como se explica [más abajo](#reiniciar-el-sistema).

El script proporciona varias opciones para cambiar la ruta en la que se despliega el portal, la aplicación a desplegar o el usuario/contraseña para la base de datos. Se pueden ver estas opciones con `-h`:

```bash
sudo ./setup.sh -h
```

Una vez el sistema está arrancado podemos acceder al portal en la URL (asumiendo que no se ha cambiado la ruta por defecto) [http://localhost/portal](http://localhost/portal).

Y GeoServer en [http://localhost:8080/geoserver](http://localhost:8080/geoserver).

## Reiniciar el sistema

Para reiniciar el sistema basta con ir al directorio de instalación (por defecto, `/var/nfms`) y reiniciar con `docker-compose`:

```bash
cd /var/nfms
docker-compose restart
```

En caso de querer reiniciar un solo componente (`db`, `geoserver`, o `portal`), basta con añadir el nombre del componente al final:


```bash
cd /var/nfms
docker-compose restart db
docker-compose restart geoserver
docker-compose restart portal
```

## Visualizar logs

Es posible visualizar los logs de los diferentes componentes, tanto juntos:

```bash
cd /var/nfms
docker-compose logs
```

como componente a componente:

```bash
cd /var/nfms
docker-compose logs db
docker-compose logs geoserver
docker-compose logs portal
```
