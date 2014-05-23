Servicio configuración (1 de 2)
=================================

En este manual se presenta la forma de implementar un servicio para visualizar algunos aspectos de la configuración, en concreto la lista de módulos que componen el cliente. En una segunda parte se mostrará cómo realizar modificaciones a la configuración.

Como se prentende mostrar un servicio, es necesario crear un servlet modificando el web.xml::

	<servlet>
		<servlet-name>module-list-servlet</servlet-name>
		<servlet-class>org.fao.unredd.portal.ModuleListServlet</servlet-class>
	</servlet>
	<servlet-mapping>
		<servlet-name>module-list-servlet</servlet-name>
		<url-pattern>/moduleList</url-pattern>
	</servlet-mapping>

y creando el fichero Java correspondiente::

	package org.fao.unredd.portal;
	
	import java.io.IOException;
	
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	public class ModuleListServlet extends HttpServlet {
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
		}
	
	}

En este caso, el servlet debe acceder a la propiedad ``client.modules`` de ``portal.properties``::

	[...]
	info.layerUrl=http://demo1.geo-solutions.it/diss_geoserver/gwc/service/wms
	client.modules=layers,communication,iso8601,error-management,map,banner,toolbar,time-slider,layer-list,info-control,info-dialog,center,zoom-bar,layer-list-selector,active-layer-list,legend-button,legend-panel
	map.centerLonLat=24, -4
	[...]

Dicha propiedad se puede obtener directamenten via el método ``getPropertyAsArray`` de la clase ``org.fao.unredd.portal.Config``. Una instancia de esta clase se puede encontrar en el ServletContext y se puede recuperar así::

	Config config = (Config) getServletContext().getAttribute("config");

Utilizando la librería ``net.sf.json`` se puede codificar la lista de módulos como JSON y devolver el resultado::

	package org.fao.unredd.portal;
	
	import java.io.IOException;
	import java.io.PrintWriter;
	
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	import net.sf.json.JSONArray;
	
	public class ModuleListServlet extends HttpServlet {
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
			Config config = (Config) getServletContext().getAttribute("config");
	
			JSONArray json = new JSONArray();
			String[] modules = config.getPropertyAsArray("client.modules");
			for (String moduleName : modules) {
				json.add(moduleName);
			}
			resp.setContentType("application/json");
			resp.setCharacterEncoding("utf8");
			PrintWriter writer = resp.getWriter();
			writer.write(json.toString());
		}
	
	}


