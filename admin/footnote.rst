Herramienta de nota al pie
==========================

El plugin "footnote" muestra un texto en la parte inferior del portal, que puede contener a su vez un enlace. El plugin soporta multiidioma.

Para incorporar este plugin a un portal, se añade como dependencia en el ``pom.xml``, como cualquier otro plugin:

.. code-block:: xml

	<dependencies>
		...
		<dependency>
			<groupId>org.fao.unredd</groupId>
			<artifactId>footnote</artifactId>
			<version>...</version>
		</dependency>
		...
	</dependencies>


Para configurar el texto a mostrar, editar el fichero ``PORTAL_CONFIG_DIR/plugin-conf.json`` y añadir la propiedad "footnote" bajo "default-conf":

.. code-block:: json

	"footnote": {
	    "text": "Texto a pie de página",
	    "link": "http://snmb-desarrollo.readthedocs.org/",
	    "align": "center"
	}


Esta propiedad acepta tres atributos:

* "text": Obligatorio. El texto a mostrar. Para portales en un sólo idioma, puede ser el texto a mostrar. Para portales multiidioma, será una referencia a la clave en el fichero de traducción (``PORTAL_CONFIG_DIR/messages/messages_*.properties``).
* "link": Opcional. Si se quiere que el texto sea un enlace, indicar aquí la página a la que enlazar.
* "align": Opcional. Indica la posición del texto: "left" (izquierda), "center" (centrado, por defecto) o "right" (derecha).


Ejemplo de configuración multiidioma
------------------------------------

Configurar la propiedad "text" con una clave (por ejemplo, "footnote.text"):

.. code-block:: json

	"footnote": {
	    "text": "footnote.text"
	}


Añadir las traducciones usando dicha clave. Por ejemplo, en ``PORTAL_CONFIG_DIR/messages/messages_es.properties``::

	footnote.text=Esto es una nota a pie en espa\u00f1ol

O en ``PORTAL_CONFIG_DIR/messages/messages_en.properties``::

	footnote.text=This is an English footnote
