package org.fao.unredd.portal;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

public class WeatherServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String lat = req.getParameter("lat");
		String lon = req.getParameter("lon");
		URL url = new URL("http://api.openweathermap.org/data/2.5/weather?lat="
				+ lat + "&lon=" + lon);
		InputStream stream = url.openStream();
		resp.setContentType("application/json");
		resp.setCharacterEncoding("utf8");
		IOUtils.copy(new BufferedInputStream(stream), resp.getOutputStream());
		stream.close();
	}
}
