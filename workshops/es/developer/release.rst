Publicación de versiones
========================

Este proceso se lanzará cada tres meses.

#. Avisar un par de semanas antes de la publicación. Aunque la fecha esté acordada es una buena práctica avisar.

#. Creación de la rama para la versión en el repositorio::

    git checkout -b release-<VERSION>
	mvn versions:set
	mvn versions:commit
	git commit -am "Bumped version numbers"

   Donde la versión tiene la forma x.y.z-SNAPSHOT:
   
   * x se incrementa si se rompe la API o el formato del directorio de configuración
   * y se incrementa cuando se incorporan nuevas funcionalidades
   * x se incrementa para parches menores
   
   La rama se sacará de la última revisión "estable" en la rama principal. 

#. Añadimos lista de mejoras a un fichero CHANGELOG. Esto se hace repasando commits desde una fecha determinada, poniendo especial cuidado en inventariar los cambios de API si es una versión mayor.

#. Cuando la rama está lista se elimina el SNAPSHOT de los pom::

	mvn versions:set
	mvn versions:commit
	git commit -am "Bumped version numbers"

   Se genera un .war y se sube al redmine.
   
   En la rama principal se deberá actualizar el número de versión también. De la forma habitual::

	mvn versions:set
	mvn versions:commit
	git commit -am "Bumped version numbers"

#. Se anuncia en la lista incluyendo el changelog y un link al nuevo war.