package org.fao.unredd.portal;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.commons.io.IOUtils;

public class LayerObjectInfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String layerid = req.getParameter("layerid");
		String objectid = req.getParameter("objectid");

		try {
			InitialContext cxt = new InitialContext();
			DataSource dataSource = (DataSource) cxt
					.lookup("java:/comp/env/jdbc/app");
			Connection connection = dataSource.getConnection();
			Statement statement = connection.createStatement();
			ResultSet resultSet = statement
					.executeQuery("SELECT url FROM layerobjectinfo WHERE layerid='"
							+ layerid + "' AND objectid='" + objectid + "'");
			ServletOutputStream outputStream = resp.getOutputStream();
			while (resultSet.next()) {
				String url = resultSet.getString(1);
				InputStream stream = new BufferedInputStream(new URL(url).openStream());
				IOUtils.copy(stream, outputStream);
				stream.close();
			}
			resultSet.close();
			statement.close();
			connection.close();
		} catch (NamingException e) {
			throw new ServletException(e);
		} catch (SQLException e) {
			throw new ServletException(e);
		}
	}
}
