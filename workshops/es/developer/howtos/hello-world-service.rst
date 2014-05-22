Servicio hola mundo
===================

El presente manual muestra cómo crear un nuevo servicio que nos devuelve un mensaje "hola mundo" en texto plano o XML, en función de un parámetro.

La primera tarea consiste en modificar el fichero web.xml para añadir un nuevo Servlet::

	<servlet>
		<servlet-name>holamundo-servlet</servlet-name>
		<servlet-class>org.fao.unredd.portal.HolaMundoServlet</servlet-class>
	</servlet>
	<servlet-mapping>
		<servlet-name>holamundo-servlet</servlet-name>
		<url-pattern>/holamundo</url-pattern>
	</servlet-mapping>

El código anterior asocia el servlet ``holamundo-servlet`` con la URL ``/holamundo`` y lo implementa con la clase ``org.fao.unredd.portal.HolaMundoServlet``. Ahora sólo es necesario implementar dicha clase::

	package org.fao.unredd.portal;
	
	import javax.servlet.http.HttpServlet;
	
	public class HolaMundoServlet extends HttpServlet{
	
		private static final long serialVersionUID = 1L;
	
		
		
	}

La única particularidad del código anterior es que el servlet debe extender a ``javax.servlet.http.HttpServlet``.

El atributo estático ``serialVersionUID`` no tiene otro objeto que evitar un warning y es totalmente irrelevante para el portal.

Si hemos hecho todo correctamente será posible, previo reinicio del servidor, acceder a la URL ``http://localhost:8080/unredd-portal/holamundo`` y obtener un error 405: método no permitido. Nótese que el mensaje es distinto si accedemos a una URL inexistente, como ``http://localhost:8080/unredd-portal/holamundonoexiste``, donde obtenemos un 404: no encontrado.

Esto quiere decir que el servlet está bien instalado. Sólo hace falta implementar el método GET, que es el que se está pidiendo el navegador::

	package org.fao.unredd.portal;
	
	import java.io.IOException;
	
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	public class HolaMundoServlet extends HttpServlet{
	
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
		}
		
	}
 
Ahora, el servidor debe devolver una página en blanco, pero no debe dar un error. Se llega así al punto en el que leeremos el parámetro y en función de este devolveremos un XML o texto plano::

	package org.fao.unredd.portal;
	
	import java.io.IOException;
	
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	public class HolaMundoServlet extends HttpServlet {
	
		private static final long serialVersionUID = 1L;
	
		@Override
		protected void doGet(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
			String outputformat = req.getParameter("outputformat");
			resp.setCharacterEncoding("utf-8");
			if ("xml".equals(outputformat)) {
				resp.setContentType("application/xml");
				resp.getWriter().write("<response>hola mundo</response>");
			} else {
				resp.setContentType("text/plain");
				resp.getWriter().write("hola mundo");
			}
		}
	
	}

