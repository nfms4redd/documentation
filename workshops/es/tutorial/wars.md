# Web ARchives

El geoportal es una aplicación web Java que se empaqueta en un fichero con extensión .war (Web ARchive) y requiere de un contenedor de aplicaciones Java para funcionar. En la presente documentación se utilizará Tomcat 7 o posterior.

## Instalación del .war en Tomcat

Una vez tenemos el fichero .war con el portal tenemos que dárselo a Tomcat para que éste lo publique. Para ello hay que copiar dicho fichero en el directorio `webapps` dentro del directorio donde Tomcat está instalado, $TOMCAT_HOME a partir de ahora.

En ese directorio podemos ver algunas aplicaciones que vienen con la instalación de Tomcat:

	$ ls $TOMCAT_HOME/webapps/
	docs  examples  host-manager  manager  ROOT  

Tras copiar el fichero quedaría así:

	$ ls $TOMCAT_HOME/webapps/
	docs  examples  host-manager  manager  ROOT  unredd-portal.war

Y si Tomcat está ejecutándose, tras unos segundos vamos a ver que se crea un directorio con el mismo nombre que el archivo .war:

	$ ls $TOMCAT_HOME/webapps/
	docs  examples  host-manager  manager  ROOT  unredd-portal  unredd-portal.war

## Logs

Lo que ha sucedido anteriormente es que Tomcat ha detectado el fichero .war en su directorio de aplicaciones, lo ha descomprimido en un directorio con su mismo nombre (los ficheros .war son ficheros comprimidos que contienen una estructura de ficheros dentro) y ha inicializado la aplicación.

Para ver que dicha inicialización ha sido correcta podemos echar un vistazo al log de Tomcat, que se encuentra en $TOMCAT_HOME/logs/catalina.out:

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

Si observamos las líneas que comienzan con `INFORMATION:` podemos observar que en la primera se notifica el inicio del despliegue del fichero portal.war y que en la última notifica que el proceso ha terminado en 888ms. Entre estas líneas podemos observar otras que comienzan por una fecha (2016-...) y que corresponden a mensajes que se dan durante la inicialización del portal. Especialmente interesante es la línea que nos indica dónde está el directorio de configuración con el que podemos personalizar el portal.

Por último, el log termina con un error indicando un fallo en la conexión a la base de datos, el cual arreglaremos más tarde.

## Reinicio del portal

En algunos casos puede ser necesario reiniciar la aplicación del portal. Casi siempre relacionado con alguna configuración que el portal sólo lee cuando se inicializa.

La manera más sencilla de hacer esto es usando el comando `touch`, que cambia la fecha del fichero a la fecha y hora actual, simulando así que el fichero acaba de ser copiado en el directorio `webapps`:

	$ touch $TOMCAT_HOME/webapps/portal.war

De nuevo, Tomcat reconocerá que hay un nuevo fichero en `webapps` (aunque en realidad no es nuevo) y procederá a su despliegue. Es importante notar que el reinicio eliminará el directorio `portal` para volver a regenerarlo. Por esto es importante **no hacer modificaciones nunca en este directorio**.

## Configuración de la conexión a la base de datos

El reinicio del portal es necesario por ejemplo cuando se cambian configuraciones a nivel de Tomcat. Es el caso de la conexión de la base de datos, que se hace a nivel de Tomcat para aprovechar que éste configura un pool de conexiones que se mantienen abiertas y se reutilizan a fin de ahorrar el coste de abrir la conexión en cada petición.

En el portal, la conexión a la base de datos es usada por el plugin de Feedback y por la visualización de estadísticas, por lo que para que estos plugins funcionen es necesario configurar la conexión a la base de datos en Tomcat.

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

PROBLEMA DE MODIFICAR EN webapps,
FICHERO donde hay que MODIFICAR
touch para reiniciar el contexto




Si observamos con detenimiento el log de Tomcat, podemos ver que tras la información sobre la inicialización del portal podemos encontrar unos errores:

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
	        at org.apache.tomcat.dbcp.dbcp.BasicDataSource.createPoolableConnectionFactory(BasicDataSource.java:1549)
	        at org.apache.tomcat.dbcp.dbcp.BasicDataSource.createDataSource(BasicDataSource.java:1388)
	        at org.apache.tomcat.dbcp.dbcp.BasicDataSource.getConnection(BasicDataSource.java:1044)
	        at org.fao.unredd.portal.DBUtils.processConnection(DBUtils.java:38)
	        ... 6 more
	Caused by: org.postgresql.util.PSQLException: Cannot connect.
	        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:233)
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
	Caused by: java.net.NoRouteToHostException: No route to host
	        at java.net.PlainSocketImpl.socketConnect(Native Method)
	        at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350)
	        at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206)
	        at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188)
	        at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
	        at java.net.Socket.connect(Socket.java:589)
	        at org.postgresql.core.PGStream.<init>(PGStream.java:61)
	        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:109)
	        ... 21 more
  
Estos errores son generados por el plugin de Feedback, que intenta conectar a la base de datos para ver si hay feedback del usuario pendiente de notificar y que utiliza la configuración existente en el fichero `context.xml` para conectar.

