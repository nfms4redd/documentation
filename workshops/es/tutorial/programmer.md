# Tutorial programación portal FAO

## Geoladris

## Hola mundo web

La web se construye básicamente sobre tres estándares:

* HTML: Nos permite definir los contenidos: textos, tablas, botones, imágenes, etc. de forma jerárquica en un documento llamado DOM (Document Object Model). Dicho de otra manera: una página HTML consiste en un DOM, que es un árbol de elementos definidos por este estándar. 
* CSS: Nos permite controlar el estilo de los elementos HTML, es decir, la forma en la que se muestran al usuario. Ejemplos de aspectos que se pueden controlar desde CSS es: color, si un elemento es visible o no, tamaño de la letra, borde y un largo etc.
* Javascript: Nos permite hacer que la página HTML/CSS interactúe con el usuario. Por ejemplo, podemos mostrar una imagen cuando se pincha en un botón o controlar que antes de enviar un formulario todos los datos son correctos.

Podemos empezar por ver una [página HTML sencilla](ejemplos/hola-mundo-web/base.html). TODO explicar el DOM.

El elemento existente en el ejemplo anterior tiene el estilo por defecto, pero con el uso de CSS podemos, por ejemplo, [cambiarle el color](ejemplos/hola-mundo-web/hola-css.html). TODO explicar que el CSS es parte del DOM. TODO explicar # y . en la selección.

Por otra parte, con el uso de Javascript podemos interactuar con el usuario, por ejemplo [decirle qué hora es](ejemplos/hola-mundo-web/hola-javascript.html)

Pero la parte que más nos va a interesar de Javascript es [modificar el DOM (HTML + CSS) de la página](ejemplos/hola-mundo-web/js-dom.html)

TODO copiar el código de los ejemplos aquí y escribir la documentación detallando los elementos del código relevantes.

## jquery

En sus inicios, jQuery permitía manipular el DOM de una manera más sencilla y más compatible. La evolución de los distintos navegadores y de los distintos estándares ha hecho estas operaciones más sencillas y cada vez tiene menos sentido utilizar jQuery. En cualquier caso, es una librería ampliamente utilizada en el portal de diseminación, por lo que es conveniente tener conocimiento de la misma. 

TODO meter los ejemplos de la documentación anterior y explicarlos.

La modificación del DOM vista en el ejemplo anterior se puede simplificar utilizando una librería llamada [jQuery](http://jquery.com).

Para ello hay que copiar la librería junto con la página HTML e importarlo desde el DOM con un tag `script`, como se puede ver en [este ejemplo](ejemplos/jquery/jquery-dom.html).

## RequireJS

Los problemas con el modo anterior de crear las páginas HTML dinámicas cuando empezamos a añadir muchas funcionalidades es que el fichero puede crecer enormemente y ser difícil de entender y por tanto de mantener y extender.

Para evitar esto podemos utilizar otra librería llamada RequireJS que permite el empaquetado de ficheros javascript en módulos y gestiona las dependencias entre estros módulos.

TODO copiar el código de los ejemplos aquí y escribir la documentación detallando los elementos del código relevantes.

## Geoladris

El uso de RequireJS facilita la modularización de las aplicaciones web pero para que una aplicación se vuelva realmente versátil y modular hace falta un concepto de más alto nivel que nos permita:

- Encapsular y reutilizar funcionalidades completas, posiblemente implementadas por varios módulos, junto con las hojas CSS asociadas.
- Modificar la configuración de los módulos de cada funcionalidad.
- Activar/Desactivar funcionalidades

Esto es lo que hace el proyecto [Geoladris](https://github.com/geoladris/), cuyo núcleo permite la encapsulación de módulos RequireJS, CSS, librerías Javascript externas, etc. en el concepto de plugin.

TODO Observación de la pestaña network con el portal de FAO e identificación de varios plugins.

En concreto, un plugin Geoladris contiene los siguientes directorios:

* `modules` con los módulos RequireJS y las hojas CSS propias de los módulos.
* `jslib` con las librerías externas usadas por el plugin.
* `styles` con las hojas CSS generales, típicamente de librerías externas.
* `themes` con hojas CSS que definen el estilo general de los elementos del DOM aportados por el plugin.

El portal de diseminación está construido sobre el núcleo de Geoladris, lo cual quiere decir que todas sus funcionalidades están agrupadas en distintos plugins que contienen la estructura de directorios recién descrita. En tanto que aplicación Java, es posible crear plugins Geoladris para extender el portal con las herramientas de programación habituales en el desarrollo de Java. Sin embargo es también posible crear plugins en el directorio de configuración, olvidándonos así de Java por completo. En lo que resta de capacitación nos centraremos en la creación de plugins **sin** necesidad de Java.

## Hola Geoladris

Partimos de la base de que el portal de FAO está instalado siguiendo las instrucciones del [capítulo sobre los wars](wars.md). 

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


