# Instalación del portal

## Portal de diseminación, una aplicación web Java

El geoportal es una aplicación web Java que se empaqueta en un fichero con extensión .war (Web ARchive) y requiere de un contenedor de aplicaciones Java para funcionar, como Apache Tomcat. En la presente documentación se utilizará Tomcat 7 o posterior.

## Arrancar y parar Tomcat

Si Tomcat se instala mediante los paquetes de Ubuntu, quedará un servicio llamado "Tomcat7" que se puede arrancar, parar y reiniciar usando el comando `service`:

	$ sudo service tomcat7 start
	$ sudo service tomcat7 stop
	$ sudo service tomcat7 restart

Tras cada uno de los pasos anteriores podemos comprobar con el navegador en el puerto `8080` si Tomcat está arrancado o parado.

Otra de las cosas que es interesante observar es el log de Tomcat, que en la instalación se encuentra en el fichero `/var/log/tomcat7/catalina.out`. Éste es posible visualizarlo con el comando `less`, pero cuando hay que reiniciar frecuentemente Tomcat, se recomienda establecer dos conexiones SSH al servidor. En una de ellas podemos ejecutar el comando `tail` siguiente:

	$ tail -f /var/log/tomcat7/catalina.out

que deja bloqueada la línea de comandos y nos muestra el contenido del log a medida que va creciendo. En la otra conexión es en la que ejecutamos los comandos `service` que arrancan y paran Tomcat.

## Instalación del .war en Tomcat

Con el comando `wget` podemos descargarnos la última versión del .war con el portal de FAO. En el siguiente ejemplo lo descargamos en `/tmp`:

	usuario@virtual-fao:/tmp$ wget http://nullisland.geomati.co:8082/repository/releases/org/fao/unredd/apps/demo/5.0.0/demo-5.0.0.war
	--2016-10-03 10:25:26--  http://nullisland.geomati.co:8082/repository/releases/org/fao/unredd/apps/demo/5.0.0/demo-5.0.0.war
	Resolving nullisland.geomati.co (nullisland.geomati.co)... 177.85.98.237
	Connecting to nullisland.geomati.co (nullisland.geomati.co)|177.85.98.237|:8082... connected.
	HTTP request sent, awaiting response... 200 OK
	Length: 6581661 (6.3M) [application/octet-stream]
	Saving to: 'demo-5.0.0.war'
	
	demo-5.0.0.war 100%[===================>]   6.28M  4.26MB/s    in 1.5s    
	
	2016-10-03 10:25:28 (4.26 MB/s) - 'demo-5.0.0.war' saved [6581661/6581661]

Una vez tenemos el fichero .war con el portal tenemos que dárselo a Tomcat para que éste lo publique. Para ello hay que copiar dicho fichero en el directorio `webapps` de Tomcat, que se encuentra en `/var/lib/tomcat7/webapps`.

En ese directorio podemos ver que hay un subdirectorio ROOT con la aplicación por defecto de Tomcat:

	$ ls /var/lib/tomcat7/webapps
	ROOT  

Tras copiar el fichero como "portal.war" quedaría así:

	$ sudo cp /tmp/demo-5.0.0-beta3.war /var/lib/tomcat7/webapps/portal.war
	$ ls /var/lib/tomcat7/webapps
	ROOT  portal.war

Y si Tomcat está ejecutándose, tras unos segundos vamos a ver que se crea un directorio con el mismo nombre que el archivo .war:

	$ ls /var/lib/tomcat7/webapps
	ROOT  portal  portal.war

## Logs

Lo que ha sucedido anteriormente es que Tomcat ha detectado el fichero .war en su directorio de aplicaciones, lo ha descomprimido en un directorio con su mismo nombre (los ficheros .war son ficheros comprimidos que contienen una estructura de ficheros dentro) y ha inicializado la aplicación.

Para ver que dicha inicialización ha sido correcta podemos echar un vistazo al log de Tomcat:

	oct 05, 2016 3:19:21 AM org.apache.catalina.startup.HostConfig deployWAR
	INFORMACIÓN: Despliegue del archivo /var/lib/tomcat7/webapps/portal.war de la aplicación web
	oct 05, 2016 3:19:22 AM org.apache.catalina.startup.TldConfig execute
	INFORMACIÓN: At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.
	oct 05, 2016 3:19:22 AM org.apache.naming.NamingContext lookup
	ADVERTENCIA: Excepción inesperada resolviendo referencia
	org.postgresql.util.PSQLException: El intento de conexión falló.
		at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:233)
		at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:64)
		at org.postgresql.jdbc2.AbstractJdbc2Connection.<init>(AbstractJdbc2Connection.java:144)
		at org.postgresql.jdbc3.AbstractJdbc3Connection.<init>(AbstractJdbc3Connection.java:29)
		at org.postgresql.jdbc3g.AbstractJdbc3gConnection.<init>(AbstractJdbc3gConnection.java:21)
		at org.postgresql.jdbc4.AbstractJdbc4Connection.<init>(AbstractJdbc4Connection.java:31)
		at org.postgresql.jdbc4.Jdbc4Connection.<init>(Jdbc4Connection.java:24)
		at org.postgresql.Driver.makeConnection(Driver.java:410)
		at org.postgresql.Driver.connect(Driver.java:280)
		at org.apache.tomcat.jdbc.pool.PooledConnection.connectUsingDriver(PooledConnection.java:278)
		at org.apache.tomcat.jdbc.pool.PooledConnection.connect(PooledConnection.java:182)
		at org.apache.tomcat.jdbc.pool.ConnectionPool.createConnection(ConnectionPool.java:710)
		at org.apache.tomcat.jdbc.pool.ConnectionPool.borrowConnection(ConnectionPool.java:644)
		at org.apache.tomcat.jdbc.pool.ConnectionPool.init(ConnectionPool.java:466)
		at org.apache.tomcat.jdbc.pool.ConnectionPool.<init>(ConnectionPool.java:143)
		at org.apache.tomcat.jdbc.pool.DataSourceProxy.pCreatePool(DataSourceProxy.java:116)
		at org.apache.tomcat.jdbc.pool.DataSourceProxy.createPool(DataSourceProxy.java:103)
		at org.apache.tomcat.jdbc.pool.DataSourceFactory.createDataSource(DataSourceFactory.java:554)
		at org.apache.tomcat.jdbc.pool.DataSourceFactory.getObjectInstance(DataSourceFactory.java:242)
		at org.apache.naming.factory.ResourceFactory.getObjectInstance(ResourceFactory.java:142)
		at javax.naming.spi.NamingManager.getObjectInstance(NamingManager.java:321)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:843)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:153)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:830)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:167)
		at org.apache.catalina.core.NamingContextListener.addResource(NamingContextListener.java:1103)
		at org.apache.catalina.core.NamingContextListener.createNamingContext(NamingContextListener.java:682)
		at org.apache.catalina.core.NamingContextListener.lifecycleEvent(NamingContextListener.java:271)
		at org.apache.catalina.util.LifecycleSupport.fireLifecycleEvent(LifecycleSupport.java:117)
		at org.apache.catalina.util.LifecycleBase.fireLifecycleEvent(LifecycleBase.java:90)
		at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:5472)
		at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:147)
		at org.apache.catalina.core.ContainerBase.addChildInternal(ContainerBase.java:899)
		at org.apache.catalina.core.ContainerBase.addChild(ContainerBase.java:875)
		at org.apache.catalina.core.StandardHost.addChild(StandardHost.java:652)
		at org.apache.catalina.startup.HostConfig.deployWAR(HostConfig.java:1091)
		at org.apache.catalina.startup.HostConfig$DeployWar.run(HostConfig.java:1980)
		at java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)
		at java.util.concurrent.FutureTask.run(FutureTask.java:266)
		at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
		at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
		at java.lang.Thread.run(Thread.java:745)
	Caused by: java.net.UnknownHostException: postgis.unredd
		at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:184)
		at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
		at java.net.Socket.connect(Socket.java:589)
		at org.postgresql.core.PGStream.<init>(PGStream.java:61)
		at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:109)
		... 41 more
	
	oct 05, 2016 3:19:22 AM org.apache.catalina.core.NamingContextListener addResource
	ADVERTENCIA: No pude registrar en JMX: javax.naming.NamingException: El intento de conexión falló.
	2016-10-05 03:19:22 WARN  ConfigFolder:49 - GEOLADRIS_CONFIG_DIR and PORTAL_CONFIG_DIR properties not found. Using /var/lib/tomcat7/webapps/portal/WEB-INF/default_config as configuration directory.
	2016-10-05 03:19:22 INFO  ConfigFolder:57 - ============================================================================
	2016-10-05 03:19:22 INFO  ConfigFolder:58 - Configuration directory: /var/lib/tomcat7/webapps/portal/WEB-INF/default_config
	2016-10-05 03:19:22 INFO  ConfigFolder:59 - ============================================================================
	oct 05, 2016 3:19:23 AM org.apache.naming.NamingContext lookup
	ADVERTENCIA: Excepción inesperada resolviendo referencia
	org.postgresql.util.PSQLException: El intento de conexión falló.
		at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:233)
		at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:64)
		at org.postgresql.jdbc2.AbstractJdbc2Connection.<init>(AbstractJdbc2Connection.java:144)
		at org.postgresql.jdbc3.AbstractJdbc3Connection.<init>(AbstractJdbc3Connection.java:29)
		at org.postgresql.jdbc3g.AbstractJdbc3gConnection.<init>(AbstractJdbc3gConnection.java:21)
		at org.postgresql.jdbc4.AbstractJdbc4Connection.<init>(AbstractJdbc4Connection.java:31)
		at org.postgresql.jdbc4.Jdbc4Connection.<init>(Jdbc4Connection.java:24)
		at org.postgresql.Driver.makeConnection(Driver.java:410)
		at org.postgresql.Driver.connect(Driver.java:280)
		at org.apache.tomcat.jdbc.pool.PooledConnection.connectUsingDriver(PooledConnection.java:278)
		at org.apache.tomcat.jdbc.pool.PooledConnection.connect(PooledConnection.java:182)
		at org.apache.tomcat.jdbc.pool.ConnectionPool.createConnection(ConnectionPool.java:710)
		at org.apache.tomcat.jdbc.pool.ConnectionPool.borrowConnection(ConnectionPool.java:644)
		at org.apache.tomcat.jdbc.pool.ConnectionPool.init(ConnectionPool.java:466)
		at org.apache.tomcat.jdbc.pool.ConnectionPool.<init>(ConnectionPool.java:143)
		at org.apache.tomcat.jdbc.pool.DataSourceProxy.pCreatePool(DataSourceProxy.java:116)
		at org.apache.tomcat.jdbc.pool.DataSourceProxy.createPool(DataSourceProxy.java:103)
		at org.apache.tomcat.jdbc.pool.DataSourceFactory.createDataSource(DataSourceFactory.java:554)
		at org.apache.tomcat.jdbc.pool.DataSourceFactory.getObjectInstance(DataSourceFactory.java:242)
		at org.apache.naming.factory.ResourceFactory.getObjectInstance(ResourceFactory.java:142)
		at javax.naming.spi.NamingManager.getObjectInstance(NamingManager.java:321)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:843)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:153)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:830)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:153)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:830)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:153)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:830)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:167)
		at org.apache.naming.SelectorContext.lookup(SelectorContext.java:156)
		at javax.naming.InitialContext.lookup(InitialContext.java:417)
		at org.geoladris.DBUtils.processConnection(DBUtils.java:30)
		at org.geoladris.DBUtils.processConnection(DBUtils.java:14)
		at org.fao.unredd.feedback.DBFeedbackPersistence.getValidatedToNotifyInfo(DBFeedbackPersistence.java:105)
		at org.fao.unredd.feedback.Feedback.notifyValidated(Feedback.java:77)
		at org.fao.unredd.feedback.servlet.FeedbackContextListener$1.run(FeedbackContextListener.java:57)
		at java.util.TimerThread.mainLoop(Timer.java:555)
		at java.util.TimerThread.run(Timer.java:505)
	Caused by: java.net.UnknownHostException: postgis.unredd
		at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:184)
		at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
		at java.net.Socket.connect(Socket.java:589)
		at org.postgresql.core.PGStream.<init>(PGStream.java:61)
		at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:109)
		... 37 more
	
	oct 05, 2016 3:19:23 AM org.apache.catalina.startup.HostConfig deployWAR
	INFORMACIÓN: Deployment of web application archive /var/lib/tomcat7/webapps/portal.war has finished in 2.098 ms
	2016-10-05 03:19:23 ERROR FeedbackContextListener:62 - Database error notifying the comment authors
	org.geoladris.PersistenceException: Cannot obtain Datasource
		at org.geoladris.DBUtils.processConnection(DBUtils.java:32)
		at org.geoladris.DBUtils.processConnection(DBUtils.java:14)
		at org.fao.unredd.feedback.DBFeedbackPersistence.getValidatedToNotifyInfo(DBFeedbackPersistence.java:105)
		at org.fao.unredd.feedback.Feedback.notifyValidated(Feedback.java:77)
		at org.fao.unredd.feedback.servlet.FeedbackContextListener$1.run(FeedbackContextListener.java:57)
		at java.util.TimerThread.mainLoop(Timer.java:555)
		at java.util.TimerThread.run(Timer.java:505)
	Caused by: javax.naming.NamingException: El intento de conexión falló.
		at org.apache.naming.NamingContext.lookup(NamingContext.java:859)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:153)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:830)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:153)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:830)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:153)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:830)
		at org.apache.naming.NamingContext.lookup(NamingContext.java:167)
		at org.apache.naming.SelectorContext.lookup(SelectorContext.java:156)
		at javax.naming.InitialContext.lookup(InitialContext.java:417)
		at org.geoladris.DBUtils.processConnection(DBUtils.java:30)
		... 6 more

Si observamos la primera línea de `INFORMACION:` podemos ver que se notifica el inicio del despliegue del fichero portal.war. Luego viene una `ADVERTENCIA` indicándonos un error en la conexión a la base de datos, que no hemos configurado todavía, y que se repite más adelante. Entre estos errores se puede observar un log del portal (comenzando por 2016-...) que nos indica el directorio de configuración `GEOLADRIS_CONFIG_DIR` y en la última entrada de `INFORMACION` podemos ver que Tomcat nos avisa de que el portal está desplegado y que el proceso de inicialización duró un par de segundos.

Por tanto, el portal ya está en funcionamiento y si navegamos a la URL `http://<ip del servidor>:8080/portal/` podremos acceder a él.

## Reinicio del portal

En algunos casos puede ser necesario reiniciar la aplicación del portal. Casi siempre relacionado con alguna configuración que el portal sólo lee cuando se inicializa.

La manera más sencilla de hacer esto es usando el comando `touch` con el fichero .war como parámetro, lo cual cambia la fecha y hora del mismo a las actuales, simulando así que acaba de ser copiado en el directorio `webapps`:

	$ sudo touch /var/lib/tomcat7/webapps/portal.war

De nuevo, Tomcat reconocerá que hay un nuevo fichero en `webapps` (aunque en realidad no es nuevo) y procederá a su despliegue. Es importante notar que el reinicio eliminará el directorio `portal` para volver a regenerarlo. Por esto es importante **no hacer modificaciones nunca en este directorio**, ya que puede borrarse de forma automática.

## Configuración de la conexión a la base de datos

Un ejemplo de configuración que requiere el reinicio del portal es la conexión a la base de datos. Ésta se hace a nivel de Tomcat para aprovechar que éste configura un pool de conexiones que se mantienen abiertas y se reutilizan, ahorrando así el coste de abrir una conexión en cada petición.

En el portal, la conexión a la base de datos es usada por el plugin de feedback y por la visualización de estadísticas, por lo que para que estos plugins funcionen es necesario configurarla correctamente.

Esta configuración se cambia en un fichero `context.xml` existente en el directorio `META-INF` que hay dentro del directorio expandido del portal, es decir, en `/var/lib/tomcat7/webapps/portal/META-INF/context.xml`.

Se trata de un fichero XML que tiene la siguiente sección:

	<Resource name="jdbc/unredd-portal" auth="Container" type="javax.sql.DataSource"
		driverClassName="org.postgresql.Driver" url="jdbc:postgresql://postgis.unredd:5432/spatialdata"
		username="spatial_user" password="unr3dd" maxActive="20" maxIdle="10"
		maxWait="-1" />

donde podemos ver que se especifica la URL de la base de datos, el usuario y password y algunos parámetros más para el pool de conexiones que Tomcat crea. Por defecto hay unos valores que se usan para pruebas durante el desarrollo y que obviamente no se adaptan a los distintos entornos de producción. Si por ejemplo, la base de datos se llama "portal" se encuentra en el mismo servidor que Tomcat y se accede con el usuario "admin_portal" y con el password "bosques", la sección anterior habrá de cambiarse así:

	<Resource name="jdbc/unredd-portal" auth="Container" type="javax.sql.DataSource"
		driverClassName="org.postgresql.Driver" url="jdbc:postgresql://localhost:5432/portal"
		username="admin_portal" password="bosques" maxActive="20" maxIdle="10"
		maxWait="-1" />

Una modificado este fichero tendremos que reiniciar el portal con el comando `touch`, lo cual regenerará el directorio portal... **¡que es donde está el fichero que acabamos de editar!**.

Es por esto, que al desplegarse el portal, dicho fichero se copia en un directorio fuera de `webapps`: `/var/lib/tomcat7/conf/Catalina/localhost/portal.xml`. Esta es la manera que ofrece Tomcat precisamente para poder modificar la configuración del .war y que esta sea persistente a los reinicios del mismo.

Una vez hecho el cambio en este fichero de la manera explicada anteriormente, el reinicio del portal se puede realizar sin temor ya que este fichero no se eliminará y la nueva configuración tendrá éxito.

Tras reiniciar el portal podremos observar que aparece en el log ahora el siguiente texto:

	oct 05, 2016 4:22:15 AM org.apache.catalina.startup.HostConfig reload
	INFORMACIÓN: Falló la recarga del contexto [/portal]
	oct 05, 2016 4:22:15 AM org.apache.catalina.core.StandardContext reload
	INFORMACIÓN: Ha comenzado la recarga de Contexto [/portal]
	oct 05, 2016 4:22:16 AM org.apache.catalina.startup.TldConfig execute
	INFORMACIÓN: At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.
	2016-10-05 04:22:16 WARN  ConfigFolder:49 - GEOLADRIS_CONFIG_DIR and PORTAL_CONFIG_DIR properties not found. Using /var/lib/tomcat7/webapps/portal/WEB-INF/default_config as configuration directory.
	2016-10-05 04:22:16 INFO  ConfigFolder:57 - ============================================================================
	2016-10-05 04:22:16 INFO  ConfigFolder:58 - Configuration directory: /var/lib/tomcat7/webapps/portal/WEB-INF/default_config
	2016-10-05 04:22:16 INFO  ConfigFolder:59 - ============================================================================
	2016-10-05 04:22:17 ERROR FeedbackContextListener:62 - Database error notifying the comment authors
	org.geoladris.PersistenceException: Database error
		at org.geoladris.DBUtils.processConnection(DBUtils.java:40)
		at org.geoladris.DBUtils.processConnection(DBUtils.java:14)
		at org.fao.unredd.feedback.DBFeedbackPersistence.getValidatedToNotifyInfo(DBFeedbackPersistence.java:105)
		at org.fao.unredd.feedback.Feedback.notifyValidated(Feedback.java:77)
		at org.fao.unredd.feedback.servlet.FeedbackContextListener$1.run(FeedbackContextListener.java:57)
		at java.util.TimerThread.mainLoop(Timer.java:555)
		at java.util.TimerThread.run(Timer.java:505)
	Caused by: org.postgresql.util.PSQLException: ERROR: relation "integration_tests.redd_feedback" does not exist
	  Position: 52
		at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2198)
		at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:1927)
		at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:255)
		at org.postgresql.jdbc2.AbstractJdbc2Statement.execute(AbstractJdbc2Statement.java:561)
		at org.postgresql.jdbc2.AbstractJdbc2Statement.executeWithFlags(AbstractJdbc2Statement.java:419)
		at org.postgresql.jdbc2.AbstractJdbc2Statement.executeQuery(AbstractJdbc2Statement.java:304)
		at org.fao.unredd.feedback.DBFeedbackPersistence$5.process(DBFeedbackPersistence.java:111)
		at org.geoladris.DBUtils$1.process(DBUtils.java:18)
		at org.geoladris.DBUtils$1.process(DBUtils.java:14)
		at org.geoladris.DBUtils.processConnection(DBUtils.java:38)
		... 6 more
	oct 05, 2016 4:22:17 AM org.apache.catalina.core.StandardContext reload
	INFORMACIÓN: Se ha completado la recarga de este Contexto

donde las líneas `INFORMATION:` hablan de "reload" (recarga) en lugar de "deployment" y ya no tenemos tantos errores como antes. El error que aparece ahora nos informa de que la tabla `integration_tests.redd_feedback` no existe, de lo que podemos deducir que nuestra configuración de conexión a la base de datos es ahora correcta.

El problema se puede resolver con dos pasos:

1. Creando las tablas que la funcionalidad de feedback y las estadísticas requieren
2. Configurando en el portal para que acceda a estas tablas

El primer paso está detallado en las instrucciones de instalación de la herramienta de [feedback](http://snmb-admin.readthedocs.io/en/latest/feedback.html#configuracion) y de las [estadísticas](http://snmb-admin.readthedocs.io/en/latest/statistics.html#instalacion).

No entraremos en detalle en esto y símplemente ejecutaremos las instrucciones SQL necesarias:

	$ psql -U portal_admin -d portal -c "
	CREATE SCHEMA redd;
	CREATE TABLE redd.redd_stats_charts (
	        id serial PRIMARY KEY,
	        title character varying,
	        subtitle character varying,
	        layer_name character varying,
	        division_field_id character varying,
	        division_field_name character varying,
	        table_name_data character varying,
	        data_table_id_field character varying,
	        data_table_date_field character varying,
	        data_table_date_field_format character varying,
	        data_table_date_field_output_format character varying
	) WITH ( OIDS=FALSE );
	CREATE TABLE redd.redd_stats_variables (
	        id serial NOT NULL PRIMARY KEY,
	        chart_id integer,
	        y_label character varying,
	        units character varying,
	        tooltipsdecimals integer,
	        variable_name character varying,
	        data_table_variable_field character varying,
	        graphic_type character varying,
	        priority integer
	);
	
	
	CREATE TABLE redd.redd_feedback (
	        id serial,
	        geometry geometry('GEOMETRY', 900913),
	        comment varchar NOT NULL,
	        layer_name varchar NOT NULL,
	        layer_date varchar,
	        date timestamp NOT NULL,
	        email varchar NOT NULL,
	        verification_code varchar,
	        language varchar,
	        state int
	);"

Para el segundo paso, tenemos que modificar el fichero `portal.properties` del directorio de configuración, que si observamos en el log, está en `/var/lib/tomcat7/webapps/portal/WEB-INF/default_config`. Solo hay un pequeño problema: **¡Está en webapps!** 

## Directorio de configuración

Ya sabemos que no debemos modificar nada que haya dentro de `webapps` porque el directorio puede regenerarse en cualquier momento y se perderían los cambios ahí realizados.

Para evitar esto es necesario sacar el directorio de configuración de `webapps` y esto se puede hacer con la variable de entorno `GEOLADRIS_CONFIG_DIR`. Esta variable apunta al directorio donde se encuentra el directorio de configuración, que se llamará igual que el directorio de la aplicación en `webapps`. Por ejemplo, si la variable apunta a `/var/geoladris/` y nuestro .war es "portal.war" entonces el directorio de configuración será `/var/geoladris/portal`.

Esta forma de definir el directorio de configuración puede ser un poco contraintuitiva, pero permite tener varios portales en un mismo Tomcat con distintos directorios de configuración.

Para configurar el directorio de nuestro portal empezamos creándolo en el sistema de ficheros:

	$ sudo mkdir -p /var/geoladris/portal

A continuación copiamos los contenidos del directorio que viene en el .war en el directorio que acabamos de crear:

	$ sudo cp -R /var/lib/tomcat7/webapps/portal/WEB-INF/default_config/* /var/geoladris/portal/

Ahora que tenemos el directorio listo, sólo hay que pasárselo a Tomcat mediante la variable de entorno `GEOLADRIS_CONFIG_DIR`. Esto se puede hacer en el fichero `/etc/default/tomcat7` añadiendo en cualquier punto las siguientes líneas:

	GEOLADRIS_CONFIG_DIR=/var/geoladris
	GEOLADRIS_CONFIG_CACHE=false

Hay que recordar que la variable apunta a `/var/geoladris` y no a `/var/geoladris/portal` ya que el "/portal" del final lo toma del nombre de la aplicación en `webapps`. Y hay que notar que se desactiva la caché de configuración, para evitar tener que reiniciar la aplicación cada vez que se cambia algo en la configuración. Esta deshabilitación sólo tiene sentido en el contexto de la capacitación y en producción la caché debería estar activada.

Por último reiniciaremos Tomcat, para que tome la nueva variable de entorno. En algún punto del log deberemos observar las siguientes líneas:

	2016-10-05 04:48:33 INFO  ConfigFolder:57 - ============================================================================
	2016-10-05 04:48:33 INFO  ConfigFolder:58 - Configuration directory: /var/geoladris/portal
	2016-10-05 04:48:33 INFO  ConfigFolder:59 - ============================================================================

que nos muestran que el directorio de configuración ya no está en `webapps` si no donde hemos configurado.

Ahora sí podemos modificar el fichero portal.properties con esta línea:

	#Schema where all the system tables are stored
	db-schema=redd

Por último, un reinicio del portal con el comando `touch` nos mostrará la recarga del portal sin errores:

	oct 05, 2016 4:51:25 AM org.apache.catalina.startup.HostConfig reload
	INFORMACIÓN: Falló la recarga del contexto [/portal]
	oct 05, 2016 4:51:25 AM org.apache.catalina.core.StandardContext reload
	INFORMACIÓN: Ha comenzado la recarga de Contexto [/portal]
	oct 05, 2016 4:51:26 AM org.apache.catalina.startup.TldConfig execute
	INFORMACIÓN: At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.
	2016-10-05 04:51:26 INFO  ConfigFolder:57 - ============================================================================
	2016-10-05 04:51:26 INFO  ConfigFolder:58 - Configuration directory: /var/geoladris/portal
	2016-10-05 04:51:26 INFO  ConfigFolder:59 - ============================================================================
	oct 05, 2016 4:51:27 AM org.apache.catalina.core.StandardContext reload
	INFORMACIÓN: Se ha completado la recarga de este Contexto

## Resumen

Esta accidentada instalación se puede resumir de forma no tan complicada:

1. Copiar el .war al directorio `webapps` de Tomcat
2. Configura la base de datos en `/var/lib/tomcat7/conf/Catalina/localhost/portal.xml`
3. Extrae el directorio de configuración fuera de `webapps` estableciendo la variable de entorno `GEOLADRIS_CONF_DIR` en el fichero `/etc/default/tomcat7`
4. Crea las tablas que el portal necesita en la base de datos

## Permisos del directorio de configuración

Durante este tutorial se van a editar muchos ficheros del directorio de configuración. Si se tratan de ediciones menores estas se pueden realizar con uno de los editores de línea de comando en el servidor, como `nano` o `vim`, pero a medida que las ediciones son más complejas vamos a necesitar un editor con más facilidades para copiar, pegar, coloración sintáctica, etc.

En este caso lo ideal es editar los ficheros en nuestra máquina local con nuestro editor favorito y luego copiar los ficheros al servidor.

Para hacer esto posible es necesario que el directorio de configuración, en este caso `/var/geoladris` tenga los permisos necesarios. La opción más sencilla de hacer esto es dándole al usuario `usuario` la propiedad de dicho directorio:

	$ sudo chown usuario:usuario /var/geoladris/ -R






 





