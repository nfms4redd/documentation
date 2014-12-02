.. _plugin_configuration:

Configuración de los plugins
=============================

Con anterioridad se ha comentado que el descriptor del plugin "xxx-conf.json" incluye un elemento para la configuración de los distintos modulos RequireJS que forman el plugin.

La configuración que se especifica en dichos elementos queda accesible a los módulos RequireJS mediante el método ``config()`` meta-modulo ``module``. Por ejemplo, si tuviéramos el siguiente descriptor de plugin::

	 {
		"default-conf" : {
			"mi-modulo" : {
				"mensaje" : "hola mundo"
			}
		}
	}

el siguiente módulo, definido en "mi-modulo.js" podría acceder a su configuración así:: 

	define([ "module" ], function(module) {
		alert(module.config());
	});

mostrando por pantalla el valor de su configuración, es decir el mensaje "hola mundo".

Modificación de la configuración en tiempo de ejecución
--------------------------------------------------------

Ahora bien, esta configuración está definida en el plugin de forma fija y sólo se puede cambiar tocando el códido del portal y generando un nuevo WAR, lo cual no es nada práctico. ¿Cómo se puede cambiar la configuración de un plugin de la aplicación una vez ésta está desplegada y ejecutándose en el servidor?

La manera más sencilla consiste en modificar el fichero ``plugin-conf.json`` que se encuentra en el directorio de configuración del portal. Este fichero tiene la misma estructura que el descriptor del plugin con la única diferencia de que es usado sólo para sobreescribir la configuración por defecto de los distintos módulos. Así, podríamos editar el fichero para dejarlo de esta manera::

	 {
		"default-conf" : {
			"mi-modulo" : {
				"ejemplo" : "hola a todo el mundo"
			}
		}
	}

Y al cargar el módulo ``mi-modulo`` aparecerá por la pantalla "hola a todo el mundo", en lugar de "hola mundo".

Modificación de la configuración por programación
---------------------------------------------------

En ocasiones la configuración que se quiere pasar al plugin depende de un valor de la base de datos, o de si el usuario está logado o, en general, de aspectos que se tienen que comprobar por programación. ¿De qué manera es posible hacer llegar estos valores a un elemento de la interfaz de usuario? La solución son los proveedores de configuración. 

Los proveedores de configuración son instancias que implementan la interfaz ``org.fao.unredd.portal.ModuleConfigurationProvider``, que permite añadir elementos a la configuración de los módulos de la misma manera que se haría manualmente modificando el fichero ``plugin-conf.json``.

Para que la instancia contribuya a la configuración hay que registrarla en la instancia config, por lo que normalmente se registrará en un context listener con un código similar al siguiente::

	ServletContext servletContext = sce.getServletContext();
	Config config = (Config) servletContext.getAttribute("config");
	config.addModuleConfigurationProvider(new MiConfigurationProvider());
 

