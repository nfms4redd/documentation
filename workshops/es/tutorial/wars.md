# Portal de diseminación, una aplicación web Java

El geoportal es una aplicación web Java que se empaqueta en un fichero con extensión .war (Web ARchive) y requiere de un contenedor de aplicaciones Java para funcionar, como Apache Tomcat. En la presente documentación se utilizará Tomcat 7 o posterior.

## Instalación del .war en Tomcat

TODO En algún punto hay que configurar el directorio de configuración, la minificación y la caché a falso. Explicar variables de entorno y propiedades de tomcat.

Una vez tenemos el fichero .war con el portal tenemos que dárselo a Tomcat para que éste lo publique. Para ello hay que copiar dicho fichero en el directorio `webapps` dentro del directorio donde Tomcat está instalado, `$TOMCAT_HOME` a partir de ahora.

En ese directorio podemos ver algunas aplicaciones que vienen con la instalación de Tomcat:

	$ ls $TOMCAT_HOME/webapps/
	docs  examples  host-manager  manager  ROOT  

Tras copiar el fichero quedaría así:

	$ ls $TOMCAT_HOME/webapps/
	docs  examples  host-manager  manager  ROOT  unredd-portal.war

Y si Tomcat está ejecutándose, tras unos segundos vamos a ver que se crea un directorio con el mismo nombre que el archivo .war:

	$ ls $TOMCAT_HOME/webapps/
	docs  examples  host-manager  manager  ROOT  unredd-portal  unredd-portal.war

TODO Configuración del directorio de configuración
TODO Configuración de la caché
 export NFMS_CONFIG_CACHE=false
 export CATALINA_OPTS="-DPORTAL_CONFIG_DIR=/home/fergonco/b/java/fao/documentation/workshops/es/tutorial/ejemplos/geoladris/mensaje-cool"
 touch ../webapps/geoladris-core.war 
 ./shutdown.sh 
 ./startup.sh 


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