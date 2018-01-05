Lectura de parámetros URL
==========================

Los parámetros de la URL son procesados por el servidor y retornados como configuración del módulo ``url-parameters``.

A su vez, el módulo ``url-parameters`` ofrece una función ``get`` en su valor de retorno que permite obtener los valores de los parámetros.

Así pues, para obtener el valor del parámetro ``lang`` podemos crear el siguiente módulo::

	define([ "url-parameters" ], function(urlParams) {
		alert(urlParams.get("lang"));
	});

Como se puede observar, se importa el módulo ``url-parameters`` en la variable ``urlParams`` y posteriormente se llama a la función ``urlParams.get`` pasando como parámetro el nombre del parámetro de la URL cuyo valor queremos obtener. Esta función retornará ``null`` en caso de que el parámetro no exista.