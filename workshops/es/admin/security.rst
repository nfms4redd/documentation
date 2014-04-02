Seguridad
=========

.. note::

	=================  ================================================
	Fecha              Autores
	=================  ================================================             
	2 Abril 2014		* Víctor González (victor.gonzalez@geomati.co)
	=================  ================================================	

	©2014 FAO Forestry
	
	Excepto donde quede reflejado de otra manera, la presente documentación se halla bajo licencia : Creative Commons (Creative Commons - Attribution - Share Alike: http://creativecommons.org/licenses/by-sa/3.0/deed.es)

Es posible que por diversos motivos se desee proteger el portal con usuario y contraseña. En este documento se explica cómo utilizar Apache para configurar la autenticación *HTTP Digest*.

En primer lugar, es necesario crear un directorio que contendrá el fichero de contraseñas::

	$ sudo mkdir /etc/apache2/passwd

Posteriormente, deberemos añadir un usuario y contraseña a ese fichero::

	$ sudo htdigest -c /etc/apache2/passwd/digest NFMS4REDD nfms
	Adding password for gis in realm NFMS4REDD.
	New password: 
	Re-type new password: 

Como se puede observar, el comando especifica el fichero donde se guardará la clave (``/etc/apache2/passwd/digest``) así como el usuario (*nfms*). También es necesario especificar, antes del usuario, el reino de autenticación (*realm*), que es un parámetro avanzado de configuración que no explicaremos aquí. Tras introducir la contraseña dos veces, el fichero está listo para ser usado.

Únicamente nos quedará configurar Apache para que utilice este fichero. En primer lugar deberemos activar el módulo de autenticación de *HTTP Digest*::

	$ sudo a2enmod auth_digest

Posteriormente, editamos el fichero ``/etc/apache2/conf.d/security``, añadiendo al final lo siguiente::

	<Location />
		ProxyPass ajp://localhost:8009/
		ProxyPassReverse ajp://localhost:8009/
		AuthType Digest
		AuthName "NFMS4REDD"
		AuthUserFile /etc/apache2/passwd/digest
		Require valid-user
	</Location>

donde *AuthName* y *AuthUserFile* deben de coincidir con el reino y el fichero que hemos utilizado en el comando ``htdigest``.

Finalmente, únicamente nos queda recargar la configuración de Apache::

	$ sudo service apache2 reload


