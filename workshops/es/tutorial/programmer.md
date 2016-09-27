# Tutorial programación portal FAO

## Geoladris

## Hola mundo web

La web se construye básicamente sobre tres estándares:

* HTML: Nos permite definir los objetos: textos, tablas, botones, imágenes, etc. de forma jerárquica en un documento llamado DOM (Document Object Model). Dicho de otra manera: una página HTML consiste en un DOM, que es un árbol de objetos definidos por este estándar. 
* CSS: Nos permite controlar el estilo de los elementos HTML, es decir, la forma en la que se muestran al usuario. Ejemplos de aspectos que se pueden controlar desde CSS es: color, si un elemento es visible o no, tamaño de la letra, borde y un largo etcétera
* Javascript: Nos permite hacer que la página HTML/CSS interactúe con el usuario. Por ejemplo, podemos mostrar una imagen cuando se pincha en un botón o controlar que antes de enviar un formulario todos los datos son correctos.

Podemos empezar por ver una [página HTML sencilla](ejemplos/hola-mundo-web/base.html). TODO explicar el DOM.

El elemento existente en el ejemplo anterior tiene el estilo por defecto, pero con el uso de CSS podemos, por ejemplo, [cambiarle el color](ejemplos/hola-mundo-web/hola-css.html).
TODO explicar que el CSS es parte del DOM (se necesita después)
TODO explicar # y . en la selección.

Por otra parte, con el uso de Javascript podemos interactuar con el usuario, por ejemplo [decirle qué hora es](ejemplos/hola-mundo-web/hola-javascript.html)

Pero la parte que más nos va a interesar de Javascript es [modificar el DOM (HTML + CSS) de la página](ejemplos/hola-mundo-web/js-dom.html)

TODO copiar el código de los ejemplos aquí y escribir la documentación detallando los elementos del código relevantes.

## jquery

En sus inicios, jQuery permitía manipular el DOM de una manera más sencilla y compatible con todos los navegadores, que implementaban el estándar de manera distinta. Actualmente, los navegadores respetan más estrictamente el estándar y cada vez tiene menos sentido utilizar jQuery. En cualquier caso, es una librería ampliamente utilizada en el portal de diseminación, por lo que es conveniente tener conocimiento de la misma. 

TODO meter los ejemplos de la documentación anterior y explicarlos.

La modificación del DOM vista en el ejemplo anterior se puede simplificar utilizando una librería llamada [jQuery](http://jquery.com).

Para ello hay que copiar la librería junto con la página HTML e importarlo desde el DOM con un tag `script`, como se puede ver en [este ejemplo](ejemplos/jquery/jquery-dom.html).

## RequireJS

Los problemas con el modo anterior de crear las páginas HTML dinámicas es que cuando empezamos a añadir muchas funcionalidades el fichero puede crecer enormemente y ser difícil de entender y por tanto de mantener y extender.

Para evitar esto podemos utilizar otra librería llamada [RequireJS](http://requirejs.org/) que permite el empaquetado de ficheros javascript en módulos y gestiona las dependencias entre estros módulos.

El ejemplo anterior podemos implementarlo con RequireJS [así](ejemplos/requirejs/hola-requirejs.html) 

TODO Objetivo: entender una aplicación RequireJS completamente (modulos, librerías y css), ver ventajas, ver limitaciones, luego trasladaremos a GeoLadris para resolver las limitaciones.

* Ejercicio: Crear el H1 como un módulo
    * Dependencia en evento-mouse para que h1-modulo se cargue antes
* Modificar todos los módulos para que el estilo inicial sea una clase css y el cambio de estilo sea otra
    * Hay que añadir la CSS a mano en el documento HTML.
* Ejercicio: Internacionalizar ambos módulos con un tercer módulo con las traducciones.
    * Explicar el valor de retorno del i18n
* Ejercicio: Usar una nueva librería. Tal vez para mostrar un mensaje al usuario en un diálogo. Si necesita CSSs mejor.
    * El nuevo módulo que usa la librería tenemos que importarlo desde ejemplo, ya que ningún otro módulo lo pide.
    * El módulo debe importar la librería y se debe configurar su ubicación.

El uso de requireJS tiene unas ventajas evidentes. Con RequireJS es fácil agrupar las funcionalidades en pequeños módulos que son más fácilmente localizables y mantenibles. Además se establece un árbol de dependencias entre los módulos que ayuda a ver qué funcionalidades son requeridas por un módulo. Sin embargo el concepto de módulo no encapsula a una funcionalidad. Cuando desarrollamos una funcionalidad:

* Desarrollamos módulos. Tal vez más de uno como es el caso de `evento-mouse`, que usa `i18n`.
* Incluimos en el documento HTML hojas de estilo CSS
* Incluimos librerías externas en un directorio y configuramos RequireJS para que las encuentre.

Así, si queremos quitar una funcionalidad, tenemos que:

* quitar los módulos
* quitar la referencia en el módulo que los carga con la llamada `require(...)`
* quitar los CSS del HTML
* quitar las librerías y su configuración de RequireJS.

En el siguiente punto vamos a ver cómo el proyecto Geoladris permite el empaquetado de todos estos aspectos en un concepto "plugin" de más alto nivel.  

TODO copiar el código de los ejemplos aquí y escribir la documentación detallando los elementos del código relevantes.

## Geoladris

[Geoladris](https://github.com/geoladris/) es un proyecto escrito en Java que permite agrupar todos los aspectos necesarios para implementar una funcionalidad (módulos RequireJS, CSS, configuración, etc.) en el concepto de plugin.

Su funcionamiento es simple: 

1. Para cada funcionalidad, existe un directorio con todos los componentes necesarios organizados de una manera precisa
2. El núcleo de Geoladris lee todos los elementos necesarios y los organiza al vuelo como una aplicación RequireJS generando la carga de CSS en el HTML, la llamada para cargar todos los módulos, etc.)

Además de esto, Geoladris nos permite:
- Activar y desactivar plugins mediante configuración.
- Modificar la configuración de los módulos de un plugin.

TODO Observación de la pestaña network con el portal de FAO e identificación de varios plugins.

La estructura de un plugin Geoladris consta de:

* `modules/` directorio con los módulos RequireJS y las hojas CSS propias de los módulos.
* `jslib/` directorio con las librerías externas usadas por el plugin.
* `styles/` directorio con las hojas CSS generales, típicamente de librerías externas.
* `themes/` directorio con hojas CSS que definen el estilo general de los elementos del DOM aportados por el plugin.
* `conf.json` fichero con la configuración del plugin

Además, toda aplicación Geoladris consta de un directorio de configuración donde se puede cambiar la configuración de los plugins y añadir nuevos plugins. 

El portal de diseminación de datos de FAO está construido sobre el núcleo de Geoladris, lo cual quiere decir que todas sus funcionalidades están agrupadas en distintos plugins que contienen la estructura de directorios recién descrita. Como aplicación Java, es posible crear plugins Geoladris para extender el portal con las herramientas de programación habituales en el desarrollo de Java. Sin embargo es también posible crear plugins en el directorio de configuración, olvidándonos así de Java por completo. En lo que resta de capacitación nos centraremos en la creación de plugins **sin** necesidad de Java.

## Hola Geoladris

Partimos de una aplicación app base de GeoLadris, que tendremos que crear en la publicación de la versión.

Explicación de los tres directorios: creación del hola mundo en el portal

Echar un vistazo a esto: https://geomatico.slack.com/files/fergonco/F2882PLKY/instrucciones_pruebas_geoladris_micho.md

## Ejemplos:

* Uso de una librería externa
* Carga de ficheros con !text

## Portal de diseminación

Partimos de la base de que el portal de FAO está instalado siguiendo las instrucciones del [capítulo sobre los wars](wars.md). 
Portal FAO = geoladris core + plugins puestos encima = Mover tu plugin anterior al portal.

## Configurando plugins

public-conf.json. Deshabilitado y configuración de los plugins. Hacer que el plugin se pueda configurar.

## Interacción con otros plugins

interacción con el resto de la aplicación (message-bus)

## Comunicación con el servidor

Descripción interacción cliente/servidor
Ejemplos en el geoportal
Requisitos del servicio usado desde Geoladris

## Plugins de interés en el portal FAO

Se muestran los eventos de los plugins que pueden ser interesantes para construir nuevos plugins
