define([ "message-bus", "botonera", "jquery", "jstree", "jquery-ui" ], function(bus, botonera, $) {

	jQuery.jstree.plugins.nohover = function() {
		this.hover_node = jQuery.noop;
	};

	var structure = [];

	var treeContainer = $("<div/>").attr("id", "layer_tree");

	botonera.newButton("árbol", function() {
		treeContainer.dialog();
	});

	bus.listen("add-group", function(event, groupInfo) {
		var parent;
		if (groupInfo.hasOwnProperty("parentId")) {
			parent = groupInfo.parentId;
		} else {
			parent = "#";
		}
		structure.push({
			"id" : groupInfo.id,
			"parent" : parent,
			"text" : groupInfo.name,
			"state" : {
				"selected" : false,
				"opened" : false
			}
		});
	});
	bus.listen("add-layer", function(event, layerInfo) {
		var leaf = {
			"id" : layerInfo.id,
			"parent" : layerInfo.groupId,
			"text" : layerInfo.label
		};
		if (layerInfo.hasOwnProperty("inlineLegendUrl")) {
			leaf.icon = layerInfo.inlineLegendUrl;
		}
		structure.push(leaf);
	});

	bus.listen("layers-loaded", function() {
		treeContainer.jstree({
			core : {
				data : structure
			},
			checkbox : {
				keep_selected_style : false
			},
			contextmenu : {
				items : function(node) {
					var id = node.id;
					return {
						zoomtolayer : {
							label : "Zoom a la capa",
							action : function(event) {
								console.log("zoom a la capa " + id);
								// http://lists.osgeo.org/pipermail/openlayers-users//2011-November/022889.html
							}
						}
					};
				}
			},
			plugins : [ "checkbox", "contextmenu", "nohover" ]
		});
	});

});