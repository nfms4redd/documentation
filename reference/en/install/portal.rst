.. module:: unredd.install.portal

Deploy and configure dissemination Portal
=========================================

Simply copy the application file ``unredd-portal.war`` to the tomcat webapps directory. For example::

  $ sudo cp unredd-portal.war /var/tomcat/webapps/portal.war

This will install and run the portal with the default (sample) configuration, accessible in:

  http://localhost/portal/


Portal configuration directory
------------------------------

To customize the portal for a new country, you need to create a new ``PORTAL_CONFIG_DIR``. An example directory is shipped with the portal application and can be found under ``/var/tomcat/portal/webapps/portal/WEB-INF/default_config``. Use it as an example to build your own configuration directory.

In order to use it as a starting point copy it to the portal configuration directory::

  $ sudo mkdir /var/portal
  $ sudo cp -R /var/tomcat/webapps/portal/WEB-INF/default_config/* /var/portal/

Further details on customization are found in :ref:`unredd-portal-customize`.

.. _database_connection_configuration:

Database connection
----------------------

The portal contains a reference to a database connection managed by the JEE container (Tomcat). In order to make this connection work it has to be configured in the file ``$CATALINE_HOME/conf/context.xml`` (remember $CATALINE_HOME is the home of the Tomcat installation)::

	<?xml version="1.0" encoding="UTF-8"?>
	<Context>
	
		<!-- Default set of monitored resources -->
		<WatchedResource>WEB-INF/web.xml</WatchedResource>
	
		<!-- Uncomment this to disable session persistence across Tomcat restarts -->
		<!-- <Manager pathname="" /> -->
	
		<!-- Uncomment this to enable Comet connection tacking (provides events 
			on session expiration as well as webapp lifecycle) -->
		<!-- <Valve className="org.apache.catalina.valves.CometConnectionManagerValve" 
			/> -->
			
		<Resource name="jdbc/unredd-portal" auth="Container"
			type="javax.sql.DataSource" driverClassName="org.postgresql.Driver"
			url="jdbc:postgresql://192.168.0.18:5432/geoserverdata" username="geoserver"
			password="unr3dd" maxActive="20" maxIdle="10" maxWait="-1" />
	
	</Context>
	
Depending on the Tomcat installation, this file can be different. The part that is necessary to configure the connection if the ``Resource`` element at the end of the file, where the connection url, username, password, etc. to make the connection are specified.