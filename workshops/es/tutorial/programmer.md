# Tutorial programación portal

## Hola mundo web

La web se construye básicamente sobre tres estándares:

* HTML: Nos permite definir los objetos: textos, tablas, botones, imágenes, etc. de forma jerárquica en un documento llamado DOM (Document Object Model). Dicho de otra manera: una página HTML consiste en un DOM, que es un árbol de objetos definidos por este estándar. 
* CSS: Nos permite controlar el estilo de los elementos HTML, es decir, la forma en la que se muestran al usuario. Ejemplos de aspectos que se pueden controlar desde CSS es: color, si un elemento es visible o no, tamaño de la letra, borde y un largo etcétera
* Javascript: Nos permite hacer que la página HTML/CSS interactúe con el usuario. Por ejemplo, podemos mostrar una imagen cuando se pincha en un botón o controlar que antes de enviar un formulario todos los datos son correctos.

A continuación se muestran algunos aspectos mediante ejemplos. Estos ejemplos no necesitan situarse en un servidor y pueden visualizarse desde el propio sistema de ficheros. Más adelante, con el uso de Geoladris veremos que sí que hace falta un componente en el servidor.

Podemos empezar por ver una [página HTML sencilla](ejemplos/hola-mundo-web/base.html).

El elemento `h1` existente en el ejemplo anterior tiene el estilo por defecto, pero con el uso de CSS podemos, por ejemplo, [cambiarle el color](ejemplos/hola-mundo-web/hola-css-style-element.html).

En dicho ejemplo hemos establecido el estilo de todos los elementos h1 con un elemento `style`. Si tenemos varios elementos `h1` y sólo queremos cambiar uno de ellos es posible [establecer el atributo `style` del elemento concreto](ejemplos/hola-mundo-web/hola-css-style-attribute.html).

Pero en general es buena idea separar el estilo del contenido, ya que el estilo se suele cambiar con frecuencia (sin ir más lejos, en función del dispositivo con el que se visualiza la página). Para ello, podemos darle un identificador al título y volver al elemento `style` pero esta vez [aplicándolo sólo al título que nos interesa](ejemplos/hola-mundo-web/hola-css-style-id.html).

Y si hubiera varios elementos a los que queremos aplicar un mismo estilo, es posible clasificarlos en un grupo (clase) y [aplicar el estilo a esa clase](ejemplos/hola-mundo-web/hola-css-style-class.html).

Por último, es posible también meter los estilos en un fichero separado y [enlazarlo desde el HTML](ejemplos/hola-mundo-web/hola-css-style-class-external.html)

Es importante retener que los estilos forman parte del DOM y que es posible seleccionar elementos concretos por id con el selector `#` y clasificar elementos y seleccionarlos con el selector `.`

Por otra parte, con el uso de Javascript podemos interactuar con el usuario, por ejemplo [decirle qué hora es](ejemplos/hola-mundo-web/hola-javascript.html)

Pero la parte que más nos va a interesar de Javascript es [modificar el DOM de la página](ejemplos/hola-mundo-web/js-dom.html), que recordamos también incluía aspectos de estilo.

## jQuery

En sus inicios, [jQuery](http://jquery.com) permitía manipular el DOM de una manera más sencilla y compatible con todos los navegadores, que implementaban el estándar de manera distinta. Actualmente, los navegadores respetan más estrictamente el estándar y cada vez tiene menos sentido utilizar jQuery. En cualquier caso, es una librería ampliamente utilizada en el portal de diseminación, por lo que es conveniente tener conocimiento de la misma. 

La modificación del DOM vista en el ejemplo anterior se puede implementar utilizando jQuery. Para ello hay que copiar la librería junto con la página HTML e importarla desde el DOM con un tag `script`, como se puede ver en [este ejemplo](ejemplos/jquery/jquery-dom.html).

## RequireJS

Los problemas con el modo anterior de crear las páginas HTML dinámicas es que cuando empezamos a añadir muchas funcionalidades el fichero puede crecer enormemente y ser difícil de entender y por tanto de mantener y extender.

Para evitar esto podemos utilizar otra librería llamada [RequireJS](http://requirejs.org/) que permite el empaquetado de ficheros javascript en módulos y gestiona las dependencias entre estos módulos.

El ejemplo anterior podemos implementarlo con RequireJS [así](ejemplos/requirejs/hola-requirejs/hola-requirejs.html) 

A continuación se plantea una serie de ejercicios que vamos a ir resolviendo añadiendo nuevos módulos al ejemplo anterior y detectando algunos aspectos a tener en cuenta.

* Ejercicio: [Crear el H1 con Javascript](ejemplos/requirejs/h1-modulo/h1-modulo.html) 
    * Dependencia en evento-mouse para que h1-modulo se cargue antes
* Ejercicio: Modificar todos los módulos para que [el estilo inicial sea una clase css y el cambio de estilo sea otra](ejemplos/requirejs/all-css/all-css.html)
    * Hay que añadir la CSS a mano en el documento HTML.
* Ejercicio: Internacionalizar ambos módulos [con un tercero con las traducciones](ejemplos/requirejs/i18n/i18n.html).
    * valores de retorno del módulo i18n
* Ejercicio: Usar una nueva librería [para mostrar un mensaje al usuario en un diálogo](ejemplos/requirejs/mensaje-cool/mensaje-cool.html).
    * El nuevo módulo que usa la librería tenemos que importarlo desde ejemplo, ya que ningún otro módulo lo pide.
    * El módulo debe importar la librería y se debe configurar la ubicación de esta última.

El uso de requireJS tiene unas ventajas evidentes. Con RequireJS es fácil agrupar las funcionalidades en pequeños módulos que son más fácilmente localizables y mantenibles. Además se establece un árbol de dependencias entre módulos que ayuda a ver qué funcionalidades son requeridas por un módulo determinado. Sin embargo el concepto de módulo no encapsula a una funcionalidad. Cuando desarrollamos una funcionalidad:

* Desarrollamos módulos. Tal vez más de uno como es el caso de `evento-mouse`, que usa `traducciones`.
* Incluimos en el documento HTML hojas de estilo CSS
* Incluimos librerías externas en un directorio y configuramos RequireJS para que las encuentre.

Así, si queremos quitar una funcionalidad, tenemos que:

* quitar los módulos
* quitar la referencia en el módulo que los carga con la llamada `require(...)`
* quitar los CSS del HTML
* quitar las librerías y su configuración de RequireJS.

En el siguiente punto vamos a ver cómo el proyecto Geoladris permite el empaquetado de todos estos aspectos en un concepto "plugin" de más alto nivel.  

## Geoladris

[Geoladris](https://github.com/geoladris/) es un proyecto escrito en Java que permite agrupar todos los aspectos necesarios para implementar una funcionalidad (módulos RequireJS, CSS, configuración, etc.) en el concepto de plugin.

Su funcionamiento es simple: 

1. Para cada funcionalidad, existe un directorio con todos los componentes necesarios organizados de una manera precisa, que se explica más adelante.
2. El núcleo de Geoladris lee todos los elementos necesarios y los ofrece como una aplicación RequireJS: generando la carga de CSS en el HTML, generando la llamada para cargar todos los módulos, etc.)

Además de esto, Geoladris nos permite:
- Activar y desactivar plugins mediante configuración.
- Modificar la configuración de los plugins.

La estructura de un plugin Geoladris consta de:

* `modules/` directorio con los módulos RequireJS y las hojas CSS propias de los módulos.
* `jslib/` directorio con las librerías externas usadas por el plugin.
* `styles/` directorio con las hojas CSS generales, típicamente de las librerías externas.
* `themes/` directorio con hojas CSS que definen el estilo general de los elementos del DOM aportados por el plugin.
* `*-conf.json` **Descriptor del plugin**, contiene la configuración de los módulos del plugin.

Para información detallada sobre el formato del descriptor del plugin se puede consultar la [documentación de referencia](https://geoladris-core.readthedocs.io/es/latest/plugins/#estructura) 

Además, toda aplicación Geoladris consta de un directorio de configuración donde se puede cambiar la configuración de los plugins y añadir nuevos plugins.

El portal de diseminación de datos de FAO está construido sobre el núcleo de Geoladris, lo cual quiere decir que todas sus funcionalidades están agrupadas en distintos plugins que contienen la estructura de directorios recién descrita. Como aplicación Java, es posible crear plugins Geoladris para extender el portal con las herramientas de programación habituales en el desarrollo de Java. Sin embargo es también posible crear plugins en el mencionado directorio de configuración, olvidándonos así de Java por completo. En lo que resta de capacitación nos centraremos en la creación de plugins **sin** necesidad de Java.

## Hola Geoladris

Para hacer una aplicación sencilla con Geoladris tenemos que instalar en Tomcat el núcleo Geoladris de [aquí](nullisland.geomati.co:8082/repository/releases/org/fao/unredd/apps/geoladris-core/5.0.0/geoladris-core-5.0.0.war) e instalarla en Tomcat. Si hemos seguido el punto sobre [instalar el portal de diseminación](wars.md) todo estará listo y bastará copiar el fichero en `webapps`. En este caso lo copiaremos con el nombre `hola-geoladris.war`

Como la variable `GEOLADRIS_CONF_DIR` ya está configurada, el directorio de configuración será `/var/geoladris/hola-geoladris/` y lo crearemos mediante el comando `mkdir` (sin sudo si hemos cambiado el propietario de `/var/geoladris`):

	$ mkdir /var/geoladris/hola-geoladris

En dicho directorio crearemos otro llamado "plugins" que es el que contendrá nuestros plugins.

	$ mkdir /var/geoladris/hola-geoladris/plugins

Si nuestro hola mundo consiste en un elemento `h1` con un mensaje, tendremos que:

1. Crear un directorio para el plugin, que llamaremos "titulo": `sudo mkdir /var/geoladris/hola-geoladris/plugins/titulo`; dentro de este directorio tendremos la estructura descrita en el punto anterior con los directorios `modules/`, `styles/`, etc.
2. En este caso sólo necesitamos crear un módulo, que meteremos en el directorio `modules/` con el siguiente contenido:

	define([ "jquery" ], function($) {
		$("<h1>")//
		.attr("id", "titulo")//
		.html("Hola mundo")//
		.appendTo("body");
		// <h1 id="titulo">Hola mundo</h1>
	});

Los ejemplos siguientes se pueden encontrar [aquí](ejemplos/geoladris/mensaje-cool), que es el directorio de configuración que contiene el directorio `plugins` que contiene todos los plugins:

* Ejemplo: Migración del ejemplo mensaje-cool a Geoladris (mensaje-cool)
* Ejemplo: Eliminar el plugin "mensaje" y observar el resultado
* Ejemplo: Eliminar el plugin i18n y observar el resultado. (es responsabilidad del usuario gestionar las dependencias entre plugins).

Además de proporcionar el concepto de plugin, el núcleo de Geoladris incorpora algunas extensiones a RequireJS que facilitan el trabajo. Por ejemplo el plugin `text` que permite cargar recursos que hay en el servidor como si fueran otro módulo. Esto nos permite por ejemplo cargar una plantilla con la interfaz gráfica, o cargar unos datos fijos utilizados para un cálculo, etc. 

TODO: ejemplo con !text

## Configurando plugins

### Habilitación y deshabilitación

Ya hemos visto que podemos eliminar algunos de los plugins. Sin embargo, si la eliminación es temporal puede ser más conveniente desactivarlo. En el directorio de configuración de Geoladris existe un fichero `public-conf.json` donde se incluye la configuración de los plugins:

	{
		"plugin1": {
		},
		"plugin2": {
		}
		...
		"pluginN": {
		}
	}

Una de las cosas que podemos configurar para un plugin es si está activo o no. Por defecto todos los plugins están activos, pero podemos desactivarlos usando la propiedad `_enabled`. Así, si queremos desactivar el plugin que muestra el mensaje podemos usar un fichero así:

	{
		"mensaje": {
			"_enabled" : false
		}
	}

Ejemplo: deshabilitar el módulo que muestra el mensaje al hacer mouse over sobre el título.

	{
		"mensaje": {
			"_enabled": false
		},
		"evento-mouse": {
			"_enabled": false
		}
	}

### Configuración de los módulos

Hasta ahora teníamos un módulo `traducciones` que incluía las cadenas en un idioma concreto. Sin embargo podría ser interesante dar la posibilidad de que el usuario añada las traducciones para otros idiomas mediante configuración.

La configuración de los módulos de un plugin se encuentra en dos lugares:

* Descriptor del plugin (`-conf.json`)
* fichero `public-conf.json` en el directorio de configuración

Vamos a ver cómo podemos darle una configuración por defecto al plugin y luego cómo sobreescribirla en el directorio de configuración.

#### Configuración por defecto

De la misma manera en la que creamos un `mensaje-conf.json` para el plugin `mensaje` vamos a crear un `i18n-conf.json` en el plugin `i18n`. Pero a diferencia del primero, en este caso no vamos a configurar RequireJS sino el módulo `i18n`:

	{
		"default-conf": {
			"traducciones": {
				"comentario": "Hem pintat el títol en roig",
				"hola": "Hola món"
			}
		}
	}

Como podemos observar, en la propiedad `default-conf` hay una propiedad `traducciones` que contiene la configuración del módulo con el mismo nombre y que consiste en pares propiedad/valor con las traducciones que antes teníamos en el código.

Ahora, en el módulo, en lugar de ofrecer directamente la lista de pares propiedad/valor, lo que vamos a hacer es leer esta documentación importando el pseudo-módulo `module` y llamando a su método `config()`:

	define(["module"], function(module) {
		var traducciones = module.config();
		return traducciones;
	});

Si ejecutamos el código veremos que el funcionamiento es exactamente el mismo y la única diferencia es que a nivel interno las cadenas de traducción se están obteniendo de la configuración.

#### Sobreescritura de la configuración por defecto

La ventaja es que ahora el usuario puede ir al directorio de configuración y poner las cadenas de traducción que considere oportunas, por ejemplo, en español:

	{
		"mensaje": {
			"_enabled" : false
		},
		"i18n": {
			"traducciones" : {
				"comentario" : "Hemos pintado el título de rojo",
				"hola": "Hola mundo"			
			}
		}
	}

## Portal de diseminación

En este punto vamos a ver que el portal de diseminación del Sistema Nacional de Monitoreo de Bosques (SNMB) es una aplicación Geoladris y que los mismos plugins que hicimos en los puntos anteriores son válidos en el contexto del portal.

Asumimos que en la misma instancia de Tomcat en la que venimos trabajando hay un fichero portal.war con la última versión del portal de diseminación, que hará que se pueda consultar el portal en la URL "http://<ip del servidor>:8080/portal".

Si hemos seguido el [capítulo sobre los wars](wars.md) habremos establecido el directorio de configuración en `/var/geoladris/portal/`.

TODO: crear un directorio de configuración en el que el zoom es toda latinoamérica y hay capas de los portales de Ecuador, Bolivia, Paraguay y Argentina. Guardar el directorio en los ejemplos de la documentación.

* Ejercicio: copiar en "plugins" del directorio de configuración del portal el plugin con el mensaje "cool". 

## Recapitulación

De nuevo hemos pasado por los distintos problemas que pueden surgir al montar una aplicación Geoladris. Y de nuevo podemos resumirlo todo en algo no tan complicado:

1. Los plugins Geoladris pueden ponerse en el directorio `plugins` del directorio de configuración.
2. Dentro del directorio de un plugin podemos encontrar distintos directorios donde meter nuestros módulos RequireJS, nuestras hojas de estilo y nuestras librerías.
3. En la raíz podemos del directorio de un plugin podemos encontrar un descriptor terminado en `-conf.json` que puede contener la información sobre la ubicación de las librerías que usa el plugin así como la configuración por defecto de los módulos que hemos programado configurables.
4. La configuración por defecto la podemos sobreescribir en el directorio de configuración, en un fichero `public-conf.json`, en el que podemos además habilitar y deshabilitar plugins.

## Interacción con otros plugins

Hemos visto que existen dependencias entre nuestros plugins y que si eliminamos un plugin, aquellos que tengan referencias al mismo van a fallar. En resumen, que tenemos que tener en cuenta manualmente las dependencias entre plugins.

Para evitar este tipo de problemas se pueden seguir una serie de estrategias. Se pueden escribir las dependencias en un fichero README o agrupar los módulos en plugins de forma más lógica para evitar las dependencias, etc.

Hay una estrategia que es usada ampliamente en las aplicaciones Geoladris, que es el uso de un bus de mensajes. Cuando una parte de la aplicación tiene que ser notificada de algo, en lugar de importar el módulo que necesitamos e invocar algún método, lo que hacemos es lanzar un evento a través de un `bus` y éste se encarga de notificar a todos los módulos interesados. Veamos un ejemplo:

* Ejemplo: crear un plugin que muestre los nombres de los países y haga zoom a los mismos.
* Ejemplo: El mismo ejemplo anterior pero haciendo zoom mediante un evento.

Lo principal que podemos observar entre las dos implementaciones de `zoom-panel.js` es que la segunda no tiene al mapa como dependencia. En su lugar tiene una referencia al módulo `message-bus`. Y esto tiene una serie de consecuencias positivas:

* ¿Cómo se llama el módulo que instala el mapa en la aplicación? A nuestro módulo le da igual.
* Ya no usamos Open Layers directamente. ¿Es OpenLayers 2? ¿OpenLayers 3? ¿Leaflet? A nuestro módulo le da igual.
* ¿Cuántos mapas hay en nuestra aplicación? ¿uno? ¿dos? ¿ninguno? A nuestro módulo le da igual.

El resultado es que nuestro módulo va a funcionar independientemente de que haya mapa o no. Obviamente si no hay mapa no tendrá efecto ninguno.

En el caso anterior era posible también recuperar la referencia al mapa, pero en otros casos la única forma de operar es con el `message-bus`. 

Ejemplo: Mostrar la leyenda de una capa usando el evento "open-legend" con el id de la capa.

## Comunicación con el servidor

Geoladris es una aplicación cliente/servidor en la que el cliente ofrece una interacción al usuario con la información que obtiene del servidor.

Para obtener información del servidor es necesario que haya un servicio en algún punto que nos devuelva un documento en algún formato (JSON, XML, etc) que la aplicación cliente utilizará para ofrecer una nueva funcionalidad al usuario. Un ejemplo de esta interacción es la herramienta de información.



Requisitos del servicio usado desde Geoladris
TODO insertar en el punto de la primera sesión que hay que desarrollar un pequeño servicio que devuelve la temperatura en las coordenadas que se pasan
TODO Comentar que GeoServer ofrece estas capacidades  
TODO Ejemplos de interacción con GeoServer (obtener la geometría en la que hemos pinchado y dibujar un buffer?)

## Plugins de interés en el portal FAO

Se muestran los eventos de los plugins que pueden ser interesantes para construir nuevos plugins

Ejemplo: internacionalización con los parámetros de la URL


