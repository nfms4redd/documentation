# Portal de diseminación, una aplicación web Java

El geoportal es una aplicación web Java que se empaqueta en un fichero con extensión .war (Web ARchive) y requiere de un contenedor de aplicaciones Java para funcionar, como Apache Tomcat. En la presente documentación se utilizará Tomcat 7 o posterior.

## Gestionando el servidor

## Arrancar y parar Tomcat

Si Tomcat se instala mediante los paquetes de Ubuntu, quedará un servicio llamado "Tomcat7" que se puede arrancar, parar y reiniciar usando el comando `service`:

	$ sudo service tomcat7 start
	$ sudo service tomcat7 stop
	$ sudo service tomcat7 restart

Tras cada uno de los pasos anteriores podemos comprobar con el navegador en el puerto `8080` si Tomcat está arrancado o parado.

Otra de las cosas que es interesante observar es el log de Tomcat, que en la instalación se encuentra en el fichero `/var/log/tomcat7/catalina.out`. Éste es posible visualizarlo con el comando `less`, pero cuando hay que trabajar con Tomcat, se recomienda establecer dos conexiones SSH al servidor. En una de ellas podemos ejecutar el comando `tail` siguiente:

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

	$ sudo cp /tmp/demo-5.0.0-beta3.war portal.war
	$ ls /var/lib/tomcat7/webapps
	ROOT  portal.war

Y si Tomcat está ejecutándose, tras unos segundos vamos a ver que se crea un directorio con el mismo nombre que el archivo .war:

	$ ls /var/lib/tomcat7/webapps
	ROOT  portal  portal.war

## Logs

Lo que ha sucedido anteriormente es que Tomcat ha detectado el fichero .war en su directorio de aplicaciones, lo ha descomprimido en un directorio con su mismo nombre (los ficheros .war son ficheros comprimidos que contienen una estructura de ficheros dentro) y ha inicializado la aplicación.

Para ver que dicha inicialización ha sido correcta podemos echar un vistazo al log de Tomcat:


	INFORMACIÓN: Server startup in 1169 ms
	oct 03, 2016 10:30:31 AM org.apache.catalina.startup.HostConfig deployWAR
	INFORMACIÓN: Despliegue del archivo /var/lib/tomcat7/webapps/portal.war de la aplicación web
	oct 03, 2016 10:30:32 AM org.apache.catalina.startup.TldConfig execute
	INFORMACIÓN: At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.
	oct 03, 2016 10:30:32 AM org.apache.naming.NamingContext lookup
	ADVERTENCIA: Excepción inesperada resolviendo referencia
	java.sql.SQLException: org.postgresql.Driver
		at org.apache.tomcat.jdbc.pool.PooledConnection.connectUsingDriver(PooledConnection.java:254)
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
	Caused by: java.lang.ClassNotFoundException: org.postgresql.Driver
		at java.net.URLClassLoader.findClass(URLClassLoader.java:381)
		at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
		at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
		at java.lang.Class.forName0(Native Method)
		at java.lang.Class.forName(Class.java:348)
		at org.apache.tomcat.jdbc.pool.PooledConnection.connectUsingDriver(PooledConnection.java:246)
		... 32 more
	
	oct 03, 2016 10:30:32 AM org.apache.catalina.core.NamingContextListener addResource
	ADVERTENCIA: No pude registrar en JMX: javax.naming.NamingException: org.postgresql.Driver
	2016-10-03 10:30:33 WARN  ConfigFolder:36 - PORTAL_CONFIG_DIR property not found. Using default config.
	2016-10-03 10:30:33 INFO  ConfigFolder:48 - ============================================================================
	2016-10-03 10:30:33 INFO  ConfigFolder:49 - PORTAL_CONFIG_DIR: /var/lib/tomcat7/webapps/portal/WEB-INF/default_config
	2016-10-03 10:30:33 INFO  ConfigFolder:50 - ============================================================================
	oct 03, 2016 10:30:33 AM org.apache.naming.NamingContext lookup
	ADVERTENCIA: Excepción inesperada resolviendo referencia
	java.sql.SQLException: org.postgresql.Driver
		at org.apache.tomcat.jdbc.pool.PooledConnection.connectUsingDriver(PooledConnection.java:254)
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
	Caused by: java.lang.ClassNotFoundException: org.postgresql.Driver
		at java.net.URLClassLoader.findClass(URLClassLoader.java:381)
		at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
		at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
		at java.lang.Class.forName0(Native Method)
		at java.lang.Class.forName(Class.java:348)
		at org.apache.tomcat.jdbc.pool.PooledConnection.connectUsingDriver(PooledConnection.java:246)
		... 28 more
	
	oct 03, 2016 10:30:33 AM org.apache.catalina.startup.HostConfig deployWAR
	INFORMACIÓN: Deployment of web application archive /var/lib/tomcat7/webapps/portal.war has finished in 2.519 ms
	2016-10-03 10:30:33 ERROR FeedbackContextListener:62 - Database error notifying the comment authors
	org.geoladris.PersistenceException: Cannot obtain Datasource
		at org.geoladris.DBUtils.processConnection(DBUtils.java:32)
		at org.geoladris.DBUtils.processConnection(DBUtils.java:14)
		at org.fao.unredd.feedback.DBFeedbackPersistence.getValidatedToNotifyInfo(DBFeedbackPersistence.java:105)
		at org.fao.unredd.feedback.Feedback.notifyValidated(Feedback.java:77)
		at org.fao.unredd.feedback.servlet.FeedbackContextListener$1.run(FeedbackContextListener.java:57)
		at java.util.TimerThread.mainLoop(Timer.java:555)
		at java.util.TimerThread.run(Timer.java:505)
	Caused by: javax.naming.NamingException: org.postgresql.Driver
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
	




	Sep 13, 2016 1:26:31 PM org.apache.catalina.startup.HostConfig deployWAR
	INFORMATION: Deploying web application archive /apps/apache-tomcat-7.0.67/webapps/portal.war
	Sep 13, 2016 1:26:31 PM org.apache.catalina.startup.TldConfig execute
	INFORMATION: At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.
	2016-09-13 13:26:31 WARN  ConfigFolder:45 - PORTAL_CONFIG_DIR property not found. Using default config.
	2016-09-13 13:26:31 INFO  ConfigFolder:58 - ============================================================================
	2016-09-13 13:26:31 INFO  ConfigFolder:59 - PORTAL_CONFIG_DIR: /apps/apache-tomcat-7.0.67/webapps/portal/WEB-INF/default_config
	2016-09-13 13:26:31 INFO  ConfigFolder:60 - ============================================================================
	2016-09-13 13:26:32 WARN  AppContextListener:69 - plugin-conf.json file for configuration has been deprecated. Use public-conf.json instead.
	Sep 13, 2016 1:26:32 PM org.apache.catalina.startup.HostConfig deployWAR
	INFORMATION: Deployment of web application archive /apps/apache-tomcat-7.0.67/webapps/portal.war has finished in 888 ms
	2016-09-13 13:26:35 ERROR FeedbackContextListener:66 - Database error notifying the comment authors
	org.fao.unredd.portal.PersistenceException: Database error
	        at org.fao.unredd.portal.DBUtils.processConnection(DBUtils.java:41)
	        at org.fao.unredd.portal.DBUtils.processConnection(DBUtils.java:14)
	        at org.fao.unredd.feedback.DBFeedbackPersistence.getValidatedToNotifyInfo(DBFeedbackPersistence.java:122)
	        at org.fao.unredd.feedback.Feedback.notifyValidated(Feedback.java:83)
	        at org.fao.unredd.feedback.servlet.FeedbackContextListener$1.run(FeedbackContextListener.java:61)
	        at java.util.TimerThread.mainLoop(Timer.java:555)
	        at java.util.TimerThread.run(Timer.java:505)
	Caused by: org.apache.tomcat.dbcp.dbcp.SQLNestedException: Cannot create PoolableConnectionFactory (Connection failed)
	[...]

Si observamos sólo las líneas que comienzan con `INFORMATION:` podemos ver que en la primera se notifica el inicio del despliegue del fichero portal.war y que en la última notifica que el proceso ha terminado en 888ms. Entre estas líneas podemos observar otras que comienzan por una fecha (2016-...) y que corresponden a mensajes que se dan durante la inicialización del portal. Especialmente interesante es la línea que nos indica dónde está el directorio de configuración con el que podemos personalizar el portal.

El último mensaje de inicialización del portal que se puede observar en el log anterior (comenzando por 2016-...) ocupa varias líneas y se corresponde con un error de conexión a la base de datos que arreglaremos más adelante.

## Reinicio del portal

En algunos casos puede ser necesario reiniciar la aplicación del portal. Casi siempre relacionado con alguna configuración que el portal sólo lee cuando se inicializa.

La manera más sencilla de hacer esto es usando el comando `touch` con el fichero .war como parámetro, lo cual cambia la fecha y hora del mismo a las actuales, simulando así que acaba de ser copiado en el directorio `webapps`:

	$ touch $TOMCAT_HOME/webapps/portal.war

De nuevo, Tomcat reconocerá que hay un nuevo fichero en `webapps` (aunque en realidad no es nuevo) y procederá a su despliegue. Es importante notar que el reinicio eliminará el directorio `portal` para volver a regenerarlo. Por esto es importante **no hacer modificaciones nunca en este directorio**, ya que puede borrarse de forma automática.

## Configuración de la conexión a la base de datos

Un ejemplo de configuración que requiere el reinicio del portal es la conexión a la base de datos. Ésta se hace a nivel de Tomcat para aprovechar que éste configura un pool de conexiones que se mantienen abiertas y se reutilizan a fin de ahorrar el coste de abrir la conexión en cada petición.

En el portal, la conexión a la base de datos es usada por el plugin de feedback y por la visualización de estadísticas, por lo que para que estos plugins funcionen es necesario configurarla.

Esta configuración se cambia en un fichero `context.xml` existente en el directorio `META-INF` que hay dentro del directorio expandido del portal, es decir, en $TOMCAT_HOME/webapps/portal/META-INF/context.xml.

Se trata de un fichero XML que tiene la siguiente sección:

	<Resource name="jdbc/unredd-portal" auth="Container" type="javax.sql.DataSource"
		driverClassName="org.postgresql.Driver" url="jdbc:postgresql://postgis.unredd:5432/spatialdata"
		username="spatial_user" password="unr3dd" maxActive="20" maxIdle="10"
		maxWait="-1" />

donde podemos ver que se puede configurar la URL de la base de datos, el usuario y password y algunos parámetros más para el pool de conexiones que Tomcat crea. Por defecto hay unos valores que se usan para pruebas durante el desarrollo y que obviamente habrá que cambiar para adaptarse al entorno donde se instale el portal. Si por ejemplo, la base de datos se llama "portal" se encuentra en el mismo servidor que Tomcat y se accede con el usuario "admin_portal" y con el password "bosques", la sección anterior habrá de cambiarse así:

	<Resource name="jdbc/unredd-portal" auth="Container" type="javax.sql.DataSource"
		driverClassName="org.postgresql.Driver" url="jdbc:postgresql://localhost:5432/portal"
		username="admin_portal" password="bosques" maxActive="20" maxIdle="10"
		maxWait="-1" />

Una modificado este fichero tendremos que reiniciar el portal con el comando `touch`, lo cual... **¡borrará el directorio "portal" y lo volverá a generar, perdiendo así nuestra configuración, que acabamos de hacer dentro del mismo!**.

Es por esto, que al desplegarse el portal, dicho fichero se copia en un directorio fuera de `webapps`: $TOMCAT_HOME/conf/Catalina/localhost/portal.xml. Esto es un mecanismo de Tomcat que se usa precisamente para poder modificar la configuración del .war y que esta sea persistente a los reinicios del mismo.

Una vez hecho el cambio en este fihero de la manera explicada anteriormente, el reinicio del portal se puede realizar sin temor ya que este fichero no se eliminará y la nueva configuración tendrá éxito.

Tras reiniciar el portal podremos observar que aparece en el log el siguiente texto:

	Sep 15, 2016 10:33:53 AM org.apache.catalina.core.StandardContext reload
	INFORMATION: Reloading Context with name [/portal] has started
	Sep 15, 2016 10:33:53 AM org.apache.catalina.loader.WebappClassLoaderBase clearReferencesJdbc
	SCHWERWIEGEND: The web application [/portal] registered the JDBC driver [org.postgresql.Driver] but failed to unregister it when the web application was stopped. To prevent a memory leak, the JDBC Driver has been forcibly unregistered.
	Sep 15, 2016 10:33:54 AM org.apache.catalina.startup.TldConfig execute
	INFORMATION: At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.
	2016-09-15 10:33:54 WARN  ConfigFolder:45 - PORTAL_CONFIG_DIR property not found. Using default config.
	2016-09-15 10:33:54 INFO  ConfigFolder:58 - ============================================================================
	2016-09-15 10:33:54 INFO  ConfigFolder:59 - PORTAL_CONFIG_DIR: /home/fergonco/b/java/fao/.metadata/.plugins/org.eclipse.wst.server.core/tmp0/wtpwebapps/demo/WEB-INF/default_config
	2016-09-15 10:33:54 INFO  ConfigFolder:60 - ============================================================================
	Sep 15, 2016 10:33:54 AM org.apache.catalina.core.StandardContext reload
	INFORMATION: Reloading Context with name [/portal] is completed

donde las líneas `INFORMATION:` hablan de "reloading" (recarga) en lugar de "deployment" y no aparece ningún error al final.