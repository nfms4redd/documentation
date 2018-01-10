Para la instalación de todo el sistema se asume la utilización de un servidor con Linux. En caso de no estar familiarizado con este sistema operativo, se recomienda leer antes una [introducción](https://geotalleres.readthedocs.io/es/latest/linux/linux.html).

> **NOTA**: Esta guía se ha realizado utilizando Ubuntu 16.04 (Xenial).

Como hemos visto en la [introducción](../index.md), el portal es una aplicación web Java que se ejecuta en Tomcat. Es imprescindible seguir las instrucciones para instalar Apache y Tomcat del apartado de [GeoServer](geoserver.md#apache-tomcat) para poder continuar.

## Instalación

Una vez tenemos Apache y Tomcat funcionando, descargaremos el portal en el directorio de aplicaciones de Tomcat:

```bash
wget http://nullisland.geomati.co:8082/repository/snapshots/org/geoladris/apps/demo/7.0.0-SNAPSHOT/demo-7.0.0-SNAPSHOT.war -O /var/lib/tomcat8/webapps/portal.war
```

## Directorio de configuración

El portal tiene un directorio de configuración que por defecto está dentro del directorio de aplicaciones de Tomcat. Por ello, si no lo movemos de sitio, cada vez que actualicemos Tomcat o el portal, perderemos su configuración. Así que primero moveremos el directorio por defecto a otra ruta:

```bash
mkdir /var/geoladris
mv /var/lib/tomcat8/webapps/portal/WEB-INF/default_config /var/geoladris/portal
```

Y luego configuraremos ese directorio al final del fichero `/etc/default/tomcat8`:

```bash
GEOLADRIS_CONFIG_DIR=/var/geoladris
```

## Base de datos

El portal tiene diferentes plugins que acceden a una base de datos para funcionar. Esta base de datos se configura en el fichero `/etc/tomcat8/Catalina/localhost/portal.xml`. En él encontraremos un elemento `<Resource>` con los datos de conexión de la base de datos (`url`, `username` y `password`). En nuestro caso, debería quedar algo así:

```xml
<Resource name="jdbc/geoladris" auth="Container" type="javax.sql.DataSource"
          driverClassName="org.postgresql.Driver"
          url="jdbc:postgresql://localhost:5432/nfms"
          username="admin" password="admin"
          maxActive="20" maxIdle="10" maxWait="-1" />
```

Por último, reiniciaremos Tomcat:

```bash
service tomcat8 restart
```

## Conexión

Llegados a este punto deberíamos poder acceder al portal desde un navegador en la URL `http://<servidor>:8080/portal`. Para eliminar el puerto `:8080` de la URL tendremos que habilitar un proxy de Apache:

```bash
a2enmod proxy_http
```

configurarlo escribiendo el fichero `/etc/apache2/mods-enabled/proxy_http.conf` con el siguiente contenido:

```bash
ProxyPreserveHost On
ProxyPass /portal  http://localhost:8080/portal
ProxyPass /portal/ http://localhost:8080/portal/
ProxyPassReverse /portal  http://localhost:8080/portal
ProxyPassReverse /portal/ http://localhost:8080/portal/
```

y por último, reiniciar Apache:

```bash
service apache2 restart
```

## Verificación del despliegue

Cuando se reinicia Tomcat, se da el caso de que todas las aplicaciones se inicializan una detrás de otra. Por tanto, el tiempo que tarda el portal en iniciarse depende de cuántas aplicaciones haya además de ésta y de lo pesadas que sean. Por ejemplo, si tenemos GeoServer con muchos datos cargados, es probable que durante el reinicio de Tomcat el portal tome más tiempo que si estuviera sólo.

Desde este momento deberíamos poder acceder al portal mediante un navegador en la URL `http://<servidor>/portal`. En el navegador podemos abrir las herramientas de desarrollo y verificar que en las pestañas de *Consola* y *Red* no aparece ningún error.

Además, se puede verificar que la inicialización del portal y la visualización en el navegador no han dado ningún error visualizando los logs. Cada vez que el portal se inicializa o se carga en un navegador, el sistema escribe información relevante en un fichero de log de Tomcat (`/var/tomcat/logs/catalina.out`). En él deberíamos encontrar algo como:

```bash
2018-01-10 12:23:48 INFO  AppContextListener:133 - ============================================================================
2018-01-10 12:23:48 INFO  AppContextListener:134 - Configuration directory: /var/geoladris/portal
2018-01-10 12:23:48 INFO  AppContextListener:135 - ============================================================================
Jan 10, 2018 12:23:48 PM org.apache.catalina.core.StandardContext reload
INFO: Reloading Context with name [/portal] is completed

```

En caso de que haya algún error nos encontraremos con algo así:

```bash
INFO: Despliegue del archivo portal.war de la aplicación web
2015-04-02 02:34:50 INFO  ConfigFolder:55 - ============================================================================
2015-04-02 02:34:50 INFO  ConfigFolder:56 - PORTAL_CONFIG_DIR: /var/argentina
2015-04-02 02:34:50 INFO  ConfigFolder:57 - ============================================================================
2015-04-02 02:34:50 DEBUG ConfigFolder:73 - Reading portal properties file /var/argentina/portal.properties
2015-04-02 02:34:50 DEBUG ConfigFolder:73 - Reading portal properties file /var/argentina/portal.properties
2015-04-02 02:34:50 ERROR FeedbackContextListener:66 - Database error notifying the comment authors
org.fao.unredd.portal.PersistenceException: Database error
    at org.fao.unredd.portal.DBUtils.processConnection(DBUtils.java:41)
    at org.fao.unredd.portal.DBUtils.processConnection(DBUtils.java:14)
    at org.fao.unredd.feedback.DBFeedbackPersistence.getValidatedToNotifyInfo(DBFeedbackPersistence.java:122)
    at org.fao.unredd.feedback.Feedback.notifyValidated(Feedback.java:83)
    at org.fao.unredd.feedback.servlet.FeedbackContextListener$1.run(FeedbackContextListener.java:61)
    at java.util.TimerThread.mainLoop(Timer.java:512)
    at java.util.TimerThread.run(Timer.java:462)
Caused by: org.apache.tomcat.dbcp.dbcp.SQLNestedException: Cannot create PoolableConnectionFactory (Conexión rechazada. Verifique que el nombre del Host y el puerto sean correctos y que postmaster este aceptando conexiones TCP/IP.)
    at org.apache.tomcat.dbcp.dbcp.BasicDataSource.createPoolableConnectionFactory(BasicDataSource.java:1549)
    at org.apache.tomcat.dbcp.dbcp.BasicDataSource.createDataSource(BasicDataSource.java:1388)
    at org.apache.tomcat.dbcp.dbcp.BasicDataSource.getConnection(BasicDataSource.java:1044)
    at org.fao.unredd.portal.DBUtils.processConnection(DBUtils.java:37)
    ... 6 more
Caused by: org.postgresql.util.PSQLException: Conexión rechazada. Verifique que el nombre del Host y el puerto sean correctos y que postmaster este aceptando conexiones TCP/IP.
    at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:215)
    at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:64)
    at org.postgresql.jdbc2.AbstractJdbc2Connection.<init>(AbstractJdbc2Connection.java:144)
    at org.postgresql.jdbc3.AbstractJdbc3Connection.<init>(AbstractJdbc3Connection.java:29)
    at org.postgresql.jdbc3g.AbstractJdbc3gConnection.<init>(AbstractJdbc3gConnection.java:21)
    at org.postgresql.jdbc4.AbstractJdbc4Connection.<init>(AbstractJdbc4Connection.java:31)
    at org.postgresql.jdbc4.Jdbc4Connection.<init>(Jdbc4Connection.java:24)
    at org.postgresql.Driver.makeConnection(Driver.java:410)
    at org.postgresql.Driver.connect(Driver.java:280)
    at org.apache.tomcat.dbcp.dbcp.DriverConnectionFactory.createConnection(DriverConnectionFactory.java:38)
    at org.apache.tomcat.dbcp.dbcp.PoolableConnectionFactory.makeObject(PoolableConnectionFactory.java:582)
    at org.apache.tomcat.dbcp.dbcp.BasicDataSource.validateConnectionFactory(BasicDataSource.java:1556)
    at org.apache.tomcat.dbcp.dbcp.BasicDataSource.createPoolableConnectionFactory(BasicDataSource.java:1545)
    ... 9 more
Caused by: java.net.ConnectException: Connection refused
    at java.net.PlainSocketImpl.socketConnect(Native Method)
    at java.net.PlainSocketImpl.doConnect(PlainSocketImpl.java:351)
    at java.net.PlainSocketImpl.connectToAddress(PlainSocketImpl.java:213)
    at java.net.PlainSocketImpl.connect(PlainSocketImpl.java:200)
    at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:366)
    at java.net.Socket.connect(Socket.java:529)
    at org.postgresql.core.PGStream.<init>(PGStream.java:61)
    at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:109)
    ... 21 more
```
