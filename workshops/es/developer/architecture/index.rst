Arquitectura
============

El portal es una aplicación cliente/servidor, en la que el cliente está programado mediante módulos Javascript que realizan distintas operaciones. Para realizar estas operaciones, el cliente accede a distintos servicios realizando llamadas asíncronas a servicios que devuelven documentos XML, JSON, etc. con la información necesaria.

El lado del servidor se basa en la especificación Servlets 3 de Java. A través de dicha especificación se pueden implementar los servicios que devuelven los documentos XML, JSON, etc. que permitirán a los módulos Javascript desarrollar su funcionalidad.

.. warning::

	Aunque la parte servidora se implementa en Java, desde el punto de vista técnico no es estrictamente necesario utilizar Java para implementar los servicios que nos interesen. Los módulos Javascript consumen los servicios a través del protocolo HTTP, que es transparente a los detalles de implementación de los servicios consumidos. En efecto, es posible desplegar una aplicación con la parte cliente accediendo a un conjunto de servicios en PHP, por ejemplo.
	
	Sin embargo, aunque la parte cliente acceda a servicios implementados en otro idioma, el sistema de plugins está implementado en Java, como veremos a continuación. Por lo que Java sigue siendo un requisito en el sistema donde se despliegue la aplicación.

A continuación se presenta el caso particular del portal (:ref:`project_architecture`). Se termina presentando la tecnología y patrones usados en el cliente (:ref:`requirejs`, :ref:`message-bus`) así como la especificación Servlet 3 de Java usada en el cliente (:ref:`servlet3`).

.. toctree::
   :maxdepth: 2

   architecture.rst
   reference.rst
   requirejs/index.rst
   message-bus/index.rst
   servlet3/index.rst