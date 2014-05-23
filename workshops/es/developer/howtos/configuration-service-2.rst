Servicio configuración (2 de 2)
=================================

En el manual anterior se muestra un servicio que devuelve un array JSON con los módulos activos en el cliente. En este manual se dará la opción de modificar esta lista de módulos eliminando un módulo mediante una petición web.

De nuevo se crea un servlet modificando el web.xml::

	<servlet>
		<servlet-name>module-removal-servlet</servlet-name>
		<servlet-class>org.fao.unredd.portal.ModuleRemovalServlet</servlet-class>
	</servlet>
	<servlet-mapping>
		<servlet-name>module-removal-servlet</servlet-name>
		<url-pattern>/moduleRemoval</url-pattern>
	</servlet-mapping>

y creando el fichero Java correspondiente::

	package org.fao.unredd.portal;
	
	import java.io.FileOutputStream;
	import java.io.IOException;
	import java.util.Properties;
	
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	public class ModuleRemovalServlet extends HttpServlet {
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
		}
	
	}

En este caso, en lugar de obtener la propiedad ``client.modules`` del fichero ``portal.properties`` es necesario modificarla, lo cual se consigue fácilmente reescribiendo el fichero completo::

	[...]
	info.layerUrl=http://demo1.geo-solutions.it/diss_geoserver/gwc/service/wms
	client.modules=layers,communication,iso8601,error-management,map,banner,toolbar,time-slider,layer-list,info-control,info-dialog,center,zoom-bar,layer-list-selector,active-layer-list,legend-button,legend-panel
	map.centerLonLat=24, -4
	[...]

Para ello son de utilidad:

* la clase ``java.util.Properties``, capaz de leer y escribir ficheros de propiedades
* el método ``getPortalPropertiesFile`` de la clase ``org.fao.unredd.portal.Config``, que devuelve la ubicación del fichero.

Para la lectura de un fichero de propiedades es necesario crear un ``InputStream`` que acceda al fichero::

		Properties properties = new Properties();
		FileInputStream inputStream = new FileInputStream(
				config.getPortalPropertiesFile());
		properties.load(inputStream);
		inputStream.close();

De forma análoga, la escritura requiere de un ``OutputStream``::

		FileOutputStream outputStream = new FileOutputStream(
				config.getPortalPropertiesFile());
		properties.store(outputStream, null);
		outputStream.close();

Para la eliminación del módulo, se procederá a convertirlo en el un ``ArrayList``, de fácil modificación, para luego regenerar la lista de elementos::

		String modules = properties.getProperty("client.modules");
		String[] moduleArray = modules.split(",");
		ArrayList<String> moduleList = new ArrayList<String>();
		Collections.addAll(moduleList, moduleArray);
		moduleList.remove(moduleName);
		properties.put("client.modules", StringUtils.join(moduleList, ','));

Finalmente el servlet quedaría así::

	package org.fao.unredd.portal;
	
	import java.io.FileInputStream;
	import java.io.FileOutputStream;
	import java.io.IOException;
	import java.util.ArrayList;
	import java.util.Collections;
	import java.util.Properties;
	
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	import org.apache.commons.lang.StringUtils;
	
	public class ModuleRemovalServlet extends HttpServlet {
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
			Config config = (Config) getServletContext().getAttribute("config");
	
			String moduleName = req.getParameter("moduleName");
	
			Properties properties = new Properties();
	
			// Lectura del fichero
			FileInputStream inputStream = new FileInputStream(
					config.getPortalPropertiesFile());
			properties.load(inputStream);
			inputStream.close();
	
			// Eliminación del módulo
			String modules = properties.getProperty("client.modules");
			String[] moduleArray = modules.split(",");
			ArrayList<String> moduleList = new ArrayList<String>();
			Collections.addAll(moduleList, moduleArray);
			moduleList.remove(moduleName);
			properties.put("client.modules", StringUtils.join(moduleList, ','));
	
			// Escritura del fichero
			FileOutputStream outputStream = new FileOutputStream(
					config.getPortalPropertiesFile());
			properties.store(outputStream, null);
			outputStream.close();
		}
	
	}

Nótese que no se devuelve ningún contenido pero que en cualquier caso, cuando el código del servlet se ejecuta sin error, al cliente le llegará un código HTML "200 OK" indicando que la operación fue satisfactoria.

Comunicación con el cliente
============================

El servlet anterior parte de la base de que las peticiones que se hagan van a ser satisfactorias, se va a eliminar el módulo, etc. Pero en la realidad esto no es la norma general. ¿Qué sucede si la petición no incluye el parámetro ``moduleName``? ¿Y si el valor no se corresponde con ninguno de los módulos existentes? ¿Qué pasa si el fichero portal.properties ha sido eliminado?

El estándar HTML define una serie de códigos que pueden ayudar en la comunicación de estas condiciones excepcionales:

* Ok (200): Ejecución satisfactoria.
* Bad Request (400): La petición no pudo ser entendida por el servidor. Aquí se puede indicar que el nombre del módulo no se encontró o que no fue especificado el parámetro. Es posible acompañar el código con un mensaje descriptivo.
* Internal server error (500): Adecuado para indicar errores graves, irrecuperables, como un bug en el código o que el fichero ``portal.properties`` no existe!

La clase ``org.fao.unredd.portal.ErrorServlet`` es la encargada de gestionar los errores que se producen en el sistema. La única característica especial que tiene es que está implementada de tal manera que si se lanza una excepción ``org.fao.unredd.portal.StatusServletException``, el código que se pasa como parámetro será el código que se le devuelva al cliente. Además, es posible especificarle a esta instrucción el mensaje que se enviará al cliente.

Por ejemplo, en caso de que se desee enviar un código 400 cuando el parámetro ``moduleName`` no esté presente se procedería así::

		if (moduleName == null) {
			throw new StatusServletException(400, "El parámetro moduleName es obligatorio");
		}

El segundo parámetro se enviaría codificado en un documento JSON, para que el cliente que realice la llamada pueda leerlo y presentarlo al usuario convenientemente. Así pues, si se accede a la URL ``http://localhost:8080/unredd-portal/moduleRemoval`` (sin el parámetro) se obtendrá como resultado un código 400 y el siguiente documento::

	{
	    "message": "El parámetro moduleName es obligatorio"
	}

Teniendo esto en cuenta, el servlet anterior se podría escribir así::

	package org.fao.unredd.portal;
	
	import java.io.FileInputStream;
	import java.io.FileOutputStream;
	import java.io.IOException;
	import java.util.ArrayList;
	import java.util.Collections;
	import java.util.Properties;
	
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	import org.apache.commons.lang.StringUtils;
	
	public class ModuleRemovalServlet extends HttpServlet {
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
			Config config = (Config) getServletContext().getAttribute("config");
	
			String moduleName = req.getParameter("moduleName");
			if (moduleName == null) {
				throw new StatusServletException(400,
						"El parámetro moduleName es obligatorio");
			}
	
			Properties properties = new Properties();
	
			// Lectura del fichero
			try {
				FileInputStream inputStream = new FileInputStream(
						config.getPortalPropertiesFile());
				properties.load(inputStream);
				inputStream.close();
			} catch (IOException e) {
				throw new StatusServletException(500,
						"Error grave en el servidor. Contacte al administrador");
			}
	
			// Eliminación del módulo
			String modules = properties.getProperty("client.modules");
			String[] moduleArray = modules.split(",");
			ArrayList<String> moduleList = new ArrayList<String>();
			Collections.addAll(moduleList, moduleArray);
			if (!moduleList.remove(moduleName)) {
				throw new StatusServletException(400,
						"El módulo especificado no existe");
			}
			properties.put("client.modules", StringUtils.join(moduleList, ','));
	
			// Escritura del fichero
			try {
				FileOutputStream outputStream = new FileOutputStream(
						config.getPortalPropertiesFile());
				properties.store(outputStream, null);
				outputStream.close();
			} catch (IOException e) {
				throw new StatusServletException(500,
						"Error grave en el servidor. Contacte al administrador");
			}
		}
	
	}

Decodificación en el cliente
-------------------------------

Por último, cabe destacar que el módulo ``communication.js`` escucha un evento ``ajax`` que permite realizar llamadas a nuestro servidor y que en caso de error leería el atributo ``message`` del documento JSON generado y lo mostraría al usuario.

El siguiente módulo hace la petición para eliminar el módulo ``banner`` cuando se pulsa un botón::

	define([ "message-bus", "botonera" ], function(bus, botonera) {
	
		botonera.newButton("remove banner", function() {
			bus.send("ajax", {
				url : "moduleRemoval?moduleName=banner",
				success : function(indicators, textStatus, jqXHR) {
					alert("módulo eliminado con éxito");
				},
				errorMsg : "No se pudo eliminar el módulo"
			});
		});
	});

La primera vez debe funcionar correctamente, pero la segunda debe fallar porque el módulo banner ya no está presente.

Como la comunicación se realiza via el módulo ``communication`` con el evento ``ajax``, en caso de error el propio módulo lee el mensaje y lo muestra al usuario.