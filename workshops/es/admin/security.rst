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

Es posible que por diversos motivos se desee proteger el portal con usuario y contraseña. En este documento se explica cómo utilizar Apache para configurar la autenticación *HTTP Basic*.

En primer lugar, es necesario crear un directorio que contendrá el fichero de contraseñas::

	$ sudo mkdir /etc/apache2/passwd

Posteriormente, deberemos añadir un usuario y contraseña a ese fichero::

	$ sudo htpasswd -c /etc/apache2/passwd/basic nfms
	New password: 
	Re-type new password: 
	Adding password for user nfms

Como se puede observar, el comando especifica el fichero donde se guardará la clave (``/etc/apache2/passwd/basic``) así como el usuario (*nfms*). Tras introducir la contraseña dos veces, el fichero está listo para ser usado.

Únicamente nos quedará configurar Apache para que utilice este fichero. Para ello  editamos el fichero ``/etc/apache2/conf.d/security``, añadiendo al final lo siguiente::

	<Location />
		ProxyPass ajp://localhost:8009/
		ProxyPassReverse ajp://localhost:8009/
		AuthType Basic
		AuthName "NFMS4REDD"
		AuthUserFile /etc/apache2/passwd/basic
		Require valid-user
	</Location>

donde *AuthUserFile* debe de coincidir con el fichero que hemos utilizado en el comando ``htpasswd``.

Finalmente, únicamente nos queda recargar la configuración de Apache::

	$ sudo service apache2 reload


