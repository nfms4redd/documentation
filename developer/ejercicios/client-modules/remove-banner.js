define([ "message-bus", "botonera" ], function(bus, botonera) {

	botonera.newButton("remove banner", function() {
		bus.send("ajax", {
			url : "eliminamodulo?modulename=banner",
			success : function(indicators, textStatus, jqXHR) {
				alert("módulo eliminado con éxito");
			},
			errorMsg : "No se pudo eliminar el módulo"
		});
	});
});
