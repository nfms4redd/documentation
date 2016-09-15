# Tutorial programación portal FAO

## Geoladris

## Hola mundo web

La web se construye básicamente sobre tres estándares:

* HTML: Nos permite definir los contenidos: textos, tablas, botones, imágenes, etc. de forma jerárquica en un documento llamado DOM (Document Object Model). Dicho de otra manera: una página HTML consiste en un DOM, que es un árbol de elementos definidos por este estándar. 
* CSS: Nos permite controlar el estilo de los elementos HTML, es decir, la forma en la que se muestran al usuario. Ejemplos de aspectos que se pueden controlar desde CSS es: color, si un elemento es visible o no, tamaño de la letra, borde y un largo etc.
* Javascript: Nos permite hacer que la página HTML/CSS interactúe con el usuario. Por ejemplo, podemos mostrar una imagen cuando se pincha en un botón o controlar que antes de enviar un formulario todos los datos son correctos.

Podemos empezar por ver una [página HTML sencilla](ejemplos/hola-mundo-web/base.html). TODO explicar el DOM.

El elemento existente en el ejemplo anterior tiene el estilo por defecto, pero con el uso de CSS podemos, por ejemplo, [cambiarle el color](ejemplos/hola-mundo-web/hola-css.html). TODO explicar que el CSS es parte del DOM.

Por otra parte, con el uso de Javascript podemos interactuar con el usuario, por ejemplo [decirle qué hora es](ejemplos/hola-mundo-web/hola-javascript.html)

Pero la parte que más nos va a interesar de Javascript es [modificar el DOM (HTML + CSS) de la página](ejemplos/hola-mundo-web/js-dom.html)

TODO copiar el código de los ejemplos aquí y escribir la documentación detallando los elementos del código relevantes.

## jquery

Creación de un ejemplo HTML mas complejo
Mismo ejemplo con jquery 

## RequireJS

RequireJS para evitar los problemas expuestos anteriormente. Aplicación anterior en requirejs.

## Plugins GeoLadris

Tecnología de FAO permite agrupar modulos requirejs, librerías Javascript normales y hojas de estilo CSS en plugins. Observación de la pestaña network. Explicación de los dos tipos de empaquetado. Nos centramos en el javascript.

## Hola Geoladris

Explicación de los tres directorios: creación del hola mundo en el portal

## Ejemplos:

* Uso de una librería externa
* Carga de ficheros con !text

## Portal de diseminación

Portal FAO = geoladris core + plugins puestos encima

## Configurando plugins

public-conf.json. Deshabilitado y configuración de los plugins.

## Interacción con otros plugins

interacción con el resto de la aplicación (message-bus)

## Comunicación con el servidor

Descripción interacción cliente/servidor
Requisitos del servicio usado desde Geoladris


