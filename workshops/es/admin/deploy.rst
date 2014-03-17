Despliegue y actualización
==========================

.. note::

	=================  ================================================
	Fecha              Autores
	=================  ================================================             
	17 Marzo 2014		* Fernando González (fernando.gonzalez@fao.org)
	=================  ================================================	

	©2013 FAO Forestry 
	
	Excepto donde quede reflejado de otra manera, la presente documentación se halla bajo licencia : Creative Commons (Creative Commons - Attribution - Share Alike: http://creativecommons.org/licenses/by-sa/3.0/deed.es)

Para desplegar el portal en el servidor basta con copiar el fichero ``portal.war`` en ``/var/tomcat/webapps/portal.war``.

Una vez copiado, si Tomcat está arrancado y funcionando, el portal se desplegará de manera automática en unos instantes.

En el caso de que se quiera **actualizar** el portal con una nueva versión, bastará con sobreescribir el fichero
``/var/tomcat/webapps/portal.war`` con la nueva versión. De nuevo, si Tomcat está arrancado y funcionando, el portal
se actualizará automáticamente en unos instantes.
