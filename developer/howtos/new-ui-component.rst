.. _newbutton:

Añadir elementos a la interfaz
================================

Se crea el módulo de la forma habitual, creando el fichero en el directorio de módulos y añadiendo el módulo como dependencia al pom.xml del proyecto.

A continuación se debe elegir en qué punto de la página se quiere añadir el botón. En este caso queremos añadirlo a la barra de herramientas principal. Para ello tenemos que obtener el objeto div de dicha barra, el cual nos lo proporciona el módulo ``toolbar``, que importaremos como dependencia::

	define([ "toolbar" ], function(toolbar) {
	
	});

Si observamos el módulo toolbar, podemos ver que devuelve un objeto jQuery con el div y que sólo tenemos que acceder al objeto ``toolbar`` para acceder al div::

	return divToolbar

En este punto podríamos realizar una prueba para comprobar que tenemos una referencia valida al div. El siguiente código hace invisible el div de la barra de herramientas::

	define([ "toolbar" ], function(toolbar) {
		toolbar.hide();	
	});

Si hemos hecho todos los pasos correctamente, veremos que la barra de herramientas no aparece, ya que la hemos escondido en nuestro módulo.

Lo único que queda por hacer es reemplazar el código de prueba anterior por otro que cree un botón. Esto lo podemos hacer creando un tag ``<button>`` con jQuery::

	define([ "toolbar", "jquery" ], function(toolbar, $) {
		var aButton = $("<button/>").attr("id", "miboton").addClass("blue_button").html("púlsame");
		aButton.appendTo(toolbar);
		aButton.click(function() {
			alert("boton pulsado");
		});
	});

Nótese que, como queremos utilizar jQuery, tenemos que declararla como un módulo y definirla como parámetro $ en la función de inicialización.

Por último, podemos añadir un fichero CSS para estilar dicho botón y añadirle un margen, por ejemplo::
	
	#miboton {
		margin: 12px;
	}
