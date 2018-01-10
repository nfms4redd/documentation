Para la instalación de todo el sistema se asume la utilización de un servidor con Linux. En caso de no estar familiarizado con este sistema operativo, se recomienda leer antes una [introducción](https://geotalleres.readthedocs.io/es/latest/linux/linux.html).

> **NOTA**: Esta guía se ha realizado utilizando Ubuntu 16.04 (Xenial).

## Apache / Tomcat

Como hemos visto en la [introducción](../index.md), GeoServer es una aplicación web Java que se ejecuta en Tomcat. Por tanto, lo primero que tenemos que hacer es instalar Apache y Tomcat:

```bash
apt update
apt install -y tomcat8 apache2
```

y arrancar los servicios:

```bash
systemctl enable tomcat8
service tomcat8 start
systemctl enable apache2
service apache2 start
```

## JAI

Las librerías JAI son unas librerías Java para el procesado de imágenes. Para instalarlas, ejecutaremos los siguientes comandos:

```bash
cd /usr/lib/jvm/java-8-*
wget http://download.java.net/media/jai/builds/release/1_1_3/jai-1_1_3-lib-linux-amd64-jdk.bin
tail -n +139 jai-1_1_3-lib-linux-amd64-jdk.bin > INSTALL-jai
chmod u+x INSTALL-jai
./INSTALL-jai
rm jai-1_1_3-lib-linux-amd64-jdk.bin INSTALL-jai *.txt
wget http://download.java.net/media/jai-imageio/builds/release/1.1/jai_imageio-1_1-lib-linux-amd64-jdk.bin
tail -n +215 jai_imageio-1_1-lib-linux-amd64-jdk.bin > INSTALL-jai_imageio
chmod u+x INSTALL-jai_imageio
./INSTALL-jai_imageio
rm jai_imageio-1_1-lib-linux-amd64-jdk.bin INSTALL-jai_imageio *.txt
```

## GeoServer

Descargaremos GeoServer:

```bash
cd /tmp
wget http://sourceforge.net/projects/geoserver/files/GeoServer/2.12.1/geoserver-2.12.1-war.zip
```

y lo desplegaremos en el directorio de aplicaciones de Tomcat:

```bash
unzip geoserver-*-war.zip -d geoserver
mv geoserver/geoserver.war /var/lib/tomcat8/webapps
rm -rf geoserver*
```

## Directorio de datos

Al desplegar GeoServer, el directorio de datos de GeoServer por defecto está dentro del directorio de aplicaciones de Tomcat. Por ello, si no lo movemos de sitio, cada vez que actualicemos Tomcat o GeoServer, perderemos este directorio de datos. Así que primero moveremos el directorio por defecto a otra ruta:

```bash
mv /var/lib/tomcat8/webapps/geoserver/data /var/local/geoserver
```

Y luego configuraremos ese directorio cambiando el valor de `JAVA_OPTS` en `/etc/default/tomcat8` por:

```bash
JAVA_OPTS="-server -Djava.awt.headless=true -Xms768m -Xmx1560m -XX:+UseConcMarkSweepGC -XX:NewSize=48m -DGEOSERVER_DATA_DIR=/var/local/geoserver"
```

Por último, reiniciaremos Tomcat:

```bash
service tomcat8 restart
```

## Conexión

Llegados a este punto deberíamos poder acceder a GeoServer desde un navegador en la URL `http://<servidor>:8080/geoserver`. Para eliminar el puerto `:8080` de la URL tendremos que habilitar un proxy de Apache:

```bash
a2enmod proxy_http
```

configurarlo escribiendo el fichero `/etc/apache2/mods-enabled/proxy_http.conf` con el siguiente contenido:

```bash
ProxyPreserveHost On
ProxyPass /geoserver  http://localhost:8080/geoserver
ProxyPass /geoserver/ http://localhost:8080/geoserver/
ProxyPassReverse /geoserver  http://localhost:8080/geoserver
ProxyPassReverse /geoserver/ http://localhost:8080/geoserver/
```

y por último, reiniciar Apache:

```bash
service apache2 restart
```

Desde este momento deberíamos poder acceder a GeoServer mediante un navegador en la URL `http://<servidor>/geoserver`.
