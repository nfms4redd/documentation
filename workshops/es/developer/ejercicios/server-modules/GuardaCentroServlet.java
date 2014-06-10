package org.fao.unredd.portal;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class GuardaCentroServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		Config config = (Config) getServletContext().getAttribute("config");
		File propertiesFile = config.getPortalPropertiesFile();

		Properties properties = new Properties();
		InputStream inStream = new FileInputStream(propertiesFile);
		properties.load(inStream);
		inStream.close();

		properties.put("map.centerLonLat",
				req.getParameter("lon") + "," + req.getParameter("lat"));
		properties.put("map.initialZoomLevel", req.getParameter("zoomLevel"));

		OutputStream outStream = new FileOutputStream(propertiesFile);
		properties.store(outStream, null);
		outStream.close();
	}
}
