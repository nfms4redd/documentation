Conexión a base de datos
==========================

Conexión a base de datos en Java
---------------------------------

Cuando queremos conectar a la base de datos desde un servicio Java tenemos que utilizar la API JDBC (Java DataBase Connectivity) de Java.

En general, el código para conectar a una base de datos en Java es el siguiente::

	Class.forName("org.postgresql.Driver");
	Connection connection = DriverManager.getConnection(
	   "jdbc:postgresql://hostname:port/dbname","username", "password");
	...
	connection.close();

.. warning::

	En el código anterior estamos conectando a una base de datos PostgreSQL, para lo cual instanciamos el driver ``org.postgresql.Driver`` y conectamos usando la URL propia de PostgreSQL ``jdbc:postgresql://hostname:port``. Estos dos aspectos cambiarán en función del tipo de base de datos a la que estemos conectando.
	
Primero, instanciamos el driver para que se autoregistre en el ``DriverManager`` y poder invocar después el método ``getConnection`` para obtener la conexión. Por último, es necesario cerrar la conexión.

Por medio del objeto de tipo ``Connection`` podremos obtener instancias de ``Statement``, con las que se pueden enviar instrucciones SQL al servidor de base de datos.

Conexión a base de datos desde una aplicación web
---------------------------------------------------

Partimos de un servicio configurado de esta manera en el descriptor de despliegue::
	
	<!-- database example -->
	<servlet>
		<servlet-name>example-db</servlet-name>
		<servlet-class>org.fao.unredd.portal.ExampleDBServlet</servlet-class>
	</servlet>
	<servlet-mapping>
		<servlet-name>example-db</servlet-name>
		<url-pattern>/example-db</url-pattern>
	</servlet-mapping>

y que implementará su funcionalidad en el método GET::

	package org.fao.unredd.portal;
	
	import java.io.IOException;
	
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	public class ExampleDBServlet extends HttpServlet {
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
				//...
		}
	
	}

Aunque sería posible poner el código anterior en el método ``doGet``, no es recomendable debido a que la creación de una conexión es siempre un proceso costoso.

Configuración conexión en el descriptor de despliegue
-------------------------------------------------------

Para evitar crear una conexión cada vez, tendremos que configurar el contenedor de aplicaciones, Tomcat en este ejemplo, para que gestione las conexiones por nosotros. Para ello, tenemos que darle a Tomcat la información necesaria para conectar modificando dos ficheros.

El primero es el fichero context.xml que existe en el directorio de configuración del servidor ``conf``. Ahí declararemos un recurso llamado "jdbc/mi-conexion" que incluirá todos los datos necesarios para conectar: url, usuario, etc.::

	<Resource name="jdbc/mis-conexiones" auth="Container" type="javax.sql.DataSource"
		driverClassName="org.postgresql.Driver" url="jdbc:postgresql://192.168.0.18:5432/geoserverdata"
		username="nfms" password="unr3dd" maxActive="20" maxIdle="10"
		maxWait="-1" />

El otro fichero a modificar es el descriptor de despliegue ``web.xml`` de nuestra aplicación, donde añadiremos una referencia al recurso anterior, "jdbc/mi-conexion"::

	<resource-ref>
		<description>Application database</description>
		<res-ref-name>jdbc/mis-conexiones</res-ref-name>
		<res-type>javax.sql.DataSource</res-type>
		<res-auth>Container</res-auth>
	</resource-ref>

.. note::

	Al ejecutar una aplicación en Tomcat desde Eclipse se crea un proyecto "Servers", que contiene una entrada para el servidor que estamos utilizando y que en el caso de Tomcat incluye los ficheros de configuración, entre otros el fichero ``context.xml`` donde configuramos el recurso. La manera más sencilla de acceder al fichero ``context`` del servidor es a través de dicho proyecto.

Una vez estos ficheros han sido modificados ya no tenemos que preocuparnos de realizar la conexión porque Tomcat las gestiona por nosotros. Pero, ¿cómo podemos obtener una de estas conexiones gestionadas por Tomcat?

El código Java cambia ligeramente, ya que ahora se obtiene un objeto de tipo ``java.sql.DataSource`` que es el que nos proporciona las conexiones::

		InitialContext context;
		DataSource dataSource;
		try {
			context = new InitialContext();
			dataSource = (DataSource) context
					.lookup("java:/comp/env/jdbc/mis-conexiones");
		} catch (NamingException e) {
			throw new ServletException("Problema en la configuración");
		}
		try {
			Connection connection = dataSource.getConnection();
			// ...
			connection.close();
		} catch (SQLException e) {
			throw new ServletException("No se pudo obtener una conexión");
		}

		try {
			context.close();
		} catch (NamingException e) {
			// ignore
		}

Si sutituímos la línea que contiene los puntos suspensivos por código que haga algo más interesante con la conexión, podemos devolver un JSON con el array de nombres que haya en una tabla::

	package org.fao.unredd.portal;
	
	import java.io.IOException;
	import java.sql.Connection;
	import java.sql.ResultSet;
	import java.sql.SQLException;
	import java.sql.Statement;
	import java.util.ArrayList;
	
	import javax.naming.InitialContext;
	import javax.naming.NamingException;
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	import javax.sql.DataSource;
	
	import net.sf.json.JSONSerializer;
	
	public class ExampleDBServlet extends HttpServlet {
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
			InitialContext context;
			DataSource dataSource;
			try {
				context = new InitialContext();
				dataSource = (DataSource) context
						.lookup("java:/comp/env/jdbc/mis-conexiones");
			} catch (NamingException e) {
				throw new ServletException("Problema en la configuración");
			}
	
			ArrayList<String> provincias = new ArrayList<String>();
			try {
				Connection connection = dataSource.getConnection();
				Statement statement = connection.createStatement();
				ResultSet result = statement
						.executeQuery("SELECT name_1 FROM gis.arg_adm1");
				while (result.next()) {
					provincias.add(result.getString("name_1"));
				}
	
				resp.setContentType("application/json");
				JSONSerializer.toJSON(provincias).write(resp.getWriter());
	
				connection.close();
			} catch (SQLException e) {
				throw new ServletException("No se pudo obtener una conexión", e);
			}
	
			try {
				context.close();
			} catch (NamingException e) {
				throw new ServletException("No se pudo liberar el recurso");
			}
		}
	
	}





