package org.fao.unredd.portal;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.io.IOUtils;

public class SaveMarkersServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String jsonString = IOUtils.toString(req.getInputStream());
		JSONObject featureCollection = (JSONObject) JSONSerializer
				.toJSON(jsonString);
		JSONArray array = (JSONArray) featureCollection.get("features");
		for (int i = 0; i < array.size(); i++) {
			JSONObject feature = (JSONObject) array.get(i);
			JSONObject geometry = (JSONObject) feature.get("geometry");
			System.out.println(geometry.get("coordinates"));
		}
	}

}
