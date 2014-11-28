.. _integration-tests:

Ejecución de los tests de integración
========================================

El proyecto que contiene los tests automatizados de integración es ``integration-tests``. En él hay una serie de tests que se hacen al WAR de ``demo`` y en el que se comprueban los servicios de los plugins que ``demo`` incluye. Como estos servicios hacen uso de bases de datos externas, es necesario realizar algún tipo de configuración previa.

Servicio de  base de datos
----------------------------

Lo primero es levantar un servicio de base de datos que pueda ser utilizado por los distintos plugins. Una vez el servicio está levantado, hay que configurar en el fichero ``integration-tests/src/main/resources/org/fao/unredd/functional/functional-test.properties`` los parámetros de dicha conexión. Por ejemplo::

	db-url=jdbc:postgresql://192.168.2.107:5432/geoserverdata
	db-user=geoserver
	db-password=unr3dd
	db-test-schema=integration_tests

Configuración del plugin Feedback
-----------------------------------

En el fichero ``portal.properties`` es necesario especificar los parámetros necesarios para que el plugin de feedback pueda encontrar la base de datos::

	feedback-db-table=integration_tests.comments
	
y pueda enviar emails::

	feedback-mail-host=smtp.gmail.com
	feedback-mail-port=587
	feedback-mail-username=miusuario@gmail.com
	feedback-mail-password=mipassword
	feedback-mail-title=Comentario en portal UNREDD
	feedback-mail-text=Por favor, visite $url para confirmar el envío.

Ejecución de los tests
--------------------------

Una vez los componentes externos están levantados y el portal configurado, sólo queda ejecutar los tests de integración::

	mvn integration-test

Sin embargo, pasaremos por la fase ``package`` que incluye una operación de optimización. Éstas se pueden evitar desactivando el perfil ``optimize``::

	mvn -P \!optimize integration-test

Para más información sobre el uso de Maven ver :ref:`build-special-features`.