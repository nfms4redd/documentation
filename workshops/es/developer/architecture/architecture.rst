Programación de servicios
------------------------------

El código en los módulos RequireJS puede realizar peticiones a los servicios de la aplicación. De igual modo que en la parte cliente, un plugin puede contribuir con servicios a la aplicación final.

La implementación de estos servicios se basa en la especificación Java Servlet 3.0 y consistirá en la implementación de uno o más *Servlets* definidos en el descriptor de despliegue. Este puede encontrarse en dos ficheros.

El primero es ``WEB-INF/web.xml`` del espacio web, es decir en ``src/main/webapp/WEB-INF/web.xml`` en la estructura por defecto de Maven. Este fichero es el descriptor de despliegue propiamente dicho, y en él se pueden definir todos los servlets necesarios en las aplicaciones, como ``demo``.

Sin embargo, en los plugins no es posible utilizar el descriptor de despliegue (web-xml) ya que no se genera ningún fichero WAR sino un JAR (que se incluirá en un WAR). En este caso, la especificación Servlet 3.0 define que las librerías JAR usadas por una aplicación WAR pueden contribuir al descriptor de despliegue mediante un fichero ``META-INF/web-fragment``. Es el caso por ejemplo del plugin ``base`` que incluye distintos servicios para acceder a indicadores sobre objetos de algunas capas del mapa::

	<?xml version="1.0" encoding="UTF-8"?>
	<web-fragment version="3.0" xmlns="http://java.sun.com/xml/ns/javaee"
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-fragment_3_0.xsd">
	
		<!-- indicators -->
		<servlet>
			<servlet-name>indicator-list-servlet</servlet-name>
			<servlet-class>org.fao.unredd.indicators.IndicatorListServlet</servlet-class>
		</servlet>
		<servlet-mapping>
			<servlet-name>indicator-list-servlet</servlet-name>
			<url-pattern>/indicators</url-pattern>
		</servlet-mapping>
		<servlet>
			<servlet-name>indicator-data-servlet</servlet-name>
			<servlet-class>org.fao.unredd.indicators.IndicatorDataServlet</servlet-class>
		</servlet>
		<servlet-mapping>
			<servlet-name>indicator-data-servlet</servlet-name>
			<url-pattern>/indicator</url-pattern>
		</servlet-mapping>
	</web-fragment>
