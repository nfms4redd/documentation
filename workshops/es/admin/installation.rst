Instalación del portal
=======================

La instalación del portal se realiza mediante el copiado del fichero .war de la aplicación al directorio ``webapps`` de la instancia Tomcat. Por ejemplo::

  $ sudo cp unredd-portal.war /var/tomcat/webapps/portal.war

En respuesta a esta acción, Tomcat descomprimirá los contenidos del WAR en un directorio con el mismo nombre que el fichero .war y la aplicación se podrá acceder en:

  http://localhost/portal/

Configuración del portal
------------------------------

Para la personalización del portal es necesario crear un directorio de configuración en ``/var/portal`` (o donde se haya configurado la variable PORTAL_CONFIG_DIR en setenv.sh). Se puede encontrar un directorio de configuración de ejemplo en el portal desempaquetado en la operación anterior, en ``/var/tomcat/portal/webapps/portal/WEB-INF/default_config``. La forma más fácil de crear el directorio de configuración es tomar el de ejemplo como base::

  $ sudo mkdir /var/portal
  $ sudo cp -R /var/tomcat/webapps/portal/WEB-INF/default_config/* /var/portal/

Funcionalidades con acceso a base de datos
-------------------------------------------

Para algunas funcionalidades, como la herramienta de feedback o las estadísticas, el portal interactúa con una base de datos. Todas las funcionalidades que necesitan apoyo de la base de datos acceden a tablas con nombre conocido en un esquema que se configura en el fichero "portal.properties", situado en el directorio de configuración del portal, mediante la propiedad ``db-schema``.

Así, para configurar estas funcionalidades hay que seguir dos pasos:

#. Especificar el esquema con la propiedad db-schema. Ver :ref:`portal_properties_configuration`.
#. Crear las tablas de nombre conocido según la funcionalidad que se desee instalar. 

   * Servicio de estadísticas, ver :ref:`instalacion_servicio_estadisticas`
   * Herramienta de feedback, ver :ref:`configuracion_herramienta_feedback`

Reinicio del portal
--------------------

Cuando se modifican datos relativos a la base de datos es necesario reiniciar el portal. Esto se hace forzando a que Tomcat redespliegue la aplicación y puede hacerse copiando el fichero de nuevo en ``/var/tomcat/webapps/`` o, más simple, mediante el comando touch::

  $ touch /var/tomcat/webapps/portal.war

Este comando cambia la fecha y hora de última modificación del fichero, forzando así a Tomcat a que vuelva a desplegar el .war. A los pocos segundos el portal se habrá reiniciado.

.. _consulta_logs_tomcat:

Verificación del despliegue
-----------------------------

Para verificar que la inicialización del portal ha sido exitosa es conveniente realizar dos comprobaciones por orden.

#. La primera es acceder a la URL del navegador y visualizar el portal. Es posible que la primera petición devuelva algún tipo de error pero tras unos pocos segundos el portal se deberá mostrar normalmente.

   .. warning::

      Cuando se reinicia el servicio de Tomcat entero en lugar de sólo el portal, se da el caso de que todas las aplicaciones se inicializan una detrás de otra. Por tanto, el tiempo que tarda el portal en iniciarse depende de cuántas aplicaciones haya además de ésta y de lo "pesadas" que sean. Por ejemplo, si tenemos GeoServer con muchos datos cargados, es probable que durante el reinicio de Tomcat el portal tome más tiempo que si estuviera sólo.

#. La segunda es verificar en los logs que la inicialización del portal y la visualización en el navegador no han dado ningún error. Para ver los errores que se dan internamente en el portal es necesario visualizar los logs. Cada vez que el portal se inicializa o se carga en un navegador, el sistema escribe información relevante en un fichero de log de Tomcat, en concreto en el fichero ``/var/tomcat/logs/catalina.out``.

   El comando ``less`` nos permite visualizar este fichero fácilmente::

      $ less /var/tomcat/logs/catalina.out

   donde encontraremos algo como esto::

		INFO: Despliegue del archivo portal.war de la aplicación web
		2015-04-02 02:22:39 INFO  ConfigFolder:55 - ============================================================================
		2015-04-02 02:22:39 INFO  ConfigFolder:56 - PORTAL_CONFIG_DIR: /var/portal
		2015-04-02 02:22:39 INFO  ConfigFolder:57 - ============================================================================
		2015-04-02 02:22:39 DEBUG ConfigFolder:73 - Reading portal properties file /var/argentina/portal.properties
		2015-04-02 02:22:39 DEBUG ConfigFolder:73 - Reading portal properties file /var/argentina/portal.properties

   En caso de que haya algún error nos encontraremos con algo así::

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
   
Para más información, consulte :ref:`portal_configuration`.

Resolución de problemas
------------------------

En los casos en los que el portal no se despliegua correctamente, es necesario buscar información sobre lo que puede estar funcionando mal.

#. Lo primero y más sencillo es abrir una herramienta como FireBug, las herramientas para desarrolladores de Firefox o de Google Chrome y realizar de nuevo la operación que da problemas. A continuación podemos echar un vistazo a:

	#. La pestaña Consola, para ver si hay algún mensaje de error.
	
	#. La pestaña Red, para ver si hay algún recurso del portal que no está descargándose de forma correcta. En caso de encontrar algún recurso con error de carga que pueda ser sospechoso, es posible hacer clic en él con el botón derecho del ratón y abrirlo en una nueva ventana, de manera que el navegador nos reporte directamente el mensaje de error.

#. La segunda consiste en visualizar los logs como se explica en el punto anterior: :ref:`consulta_logs_tomcat`. 




 