Hello World
============

Lo primero es crear un nuevo fichero hola-mundo.js en el directorio de módulos. Como contenido podemos definir símplemente::

	alert("hola mundo");

A continuación registramos el módulo en el fichero portal.properties. En su propiedad ``client.modules`` añadimos el nombre de nuestro módulo, que no es otro que el nombre del fichero sin la extensión .js::

	client.modules=hola-mundo,layers,communication,iso8601,error-management,map,banner,toolbar,time-slider,layer-list,info-control,info-dialog,center,zoom-bar,layer-list-selector,active-layer-list,legend-button,legend-panel

Al recargar el portal nos encontraremos con el mensaje "hola mundo" nada más empezar.