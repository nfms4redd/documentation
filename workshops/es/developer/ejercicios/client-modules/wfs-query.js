define([ "jquery", "message-bus", "jquery-ui" ], function($, bus) {

	var divFilter = $("<div/>").attr("id", "dataFilter");

	var cmbLayers = $("<select/>").attr("id", "dataFilter_layer").appendTo(divFilter);
	var cmbFields = $("<select/>").attr("id", "dataFilter_field").appendTo(divFilter);
	var cmbOperators = $("<select/>").attr("id", "dataFilter_operator").appendTo(divFilter);
	operators = [ "==", "!=", "<", ">", "<=", ">=", "~" ];
	for (var i = 0; i < operators.length; i++) {
		$("<option/>").val(operators[i]).text(operators[i]).appendTo(cmbOperators);
	}
	var txtValue = $("<input/>").attr("id", "dataFilter_value").attr("type", "text").appendTo(divFilter);
	var btnFilter = $("<button/>").html("Filtra").appendTo(divFilter);

	var tbl = $("<table/>").attr("id", "dataFilter_tbl").appendTo(divFilter);

	cmbLayers.change(function() {
		OpenLayers.Request.GET({
			url : "http://demo1.geo-solutions.it/diss_geoserver/wfs?" + //
			"request=DescribeFeatureType&service=WFS&VERSION=1.0.0&TypeName=" + cmbLayers.val(),
			callback : function(response) {
				var featureTypesParser = new OpenLayers.Format.WFSDescribeFeatureType();
				var responseText = featureTypesParser.read(response.responseText);
				var featureTypes = responseText.featureTypes;
				var properties = featureTypes[0].properties;
				cmbFields.empty();
				for (var i = 0; i < properties.length; i++) {
					$("<option/>").val(properties[i].name).text(properties[i].name).appendTo(cmbFields);
				}
			}
		});

	});

	btnFilter.click(function() {
		var wfsProtocol = new OpenLayers.Protocol.WFS({
			url : "http://demo1.geo-solutions.it/diss_geoserver/unredd/wfs",
			featureType : "drc_provinces"
		});

		// try to get just the structure
		wfsProtocol.read({
			filter : new OpenLayers.Filter.Comparison({
				type : cmbOperators.val(),
				property : cmbFields.val(),
				value : txtValue.val()
			}),
			callback : function(resp) {
				tbl.empty();
				var features = resp.features;
				if (features.length > 0) {
					var tr = $("<tr/>").appendTo(tbl);
					for (attribute in features[0].attributes) {
						$("<th/>").html(attribute).appendTo(tr);
					}
				}
				for (var i = 0; i < features.length; i++) {
					var tr = $("<tr/>").appendTo(tbl);
					var attributes = features[i].attributes;
					for (attribute in attributes) {
						$("<td/>").html(attributes[attribute]).appendTo(tr);
					}
				}
			}
		});
	});

	bus.listen("add-portal-layer", function(event, layerInfo) {
		$("<option/>").val(layerInfo.wmsLayers[0].wmsName).text(layerInfo.label).appendTo(cmbLayers);
	});

	divFilter.dialog({
		closeOnEscape : true,
		width : "80%",
		resizable : true
	});

});