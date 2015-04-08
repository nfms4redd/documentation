Herramienta de feedback
========================

La herramienta de feedback permite al usuario del portal proporcionar comentarios sobre determinadas regiones de las capas del mapa.

.. _configuracion_herramienta_feedback:

Configuración
------------

La creación y almacenamiento de estos comentarios requiere de 1) una tabla en la base de datos y 2) una cuenta de e-mail para el intercambio de mensajes entre el sistema, el usuario y el técnico que valida el comentario.

Almacenamiento de los comentarios
........................................

Para almacenar los comentarios se utilizará una tabla llamada ``redd_feedback`` que debe existir en el esquema definido por la propiedad ``db-schema`` en el fichero ``portal.properties``:

.. code-block:: sql

	CREATE TABLE redd_feedback (
		id serial,
		geometry geometry('GEOMETRY', 900913),
		comment varchar NOT NULL,
		layer_name varchar NOT NULL,
		layer_date varchar,
		date timestamp NOT NULL,
		email varchar NOT NULL,
		verification_code varchar,
		language varchar,
		state int
	);

Esta tabla alojará un registro por cada comentario hecho por el usuario. En ella podemos ver los siguientes campos:

* id: identificador de los comentarios
* geometry: geometría que identifica la región a la que afecta el comentario. Es dibujada por el usuario en el portal. En sistema de coordenadas EPSG:900913.
* comment: comentario realizado por el usuario
* layer_name: identificador de la ``portalLayer`` definida en el fichero layers.json que el usuario seleccionó para hacer el comentario.
* layer_date: instante para el cual el comentario se ha realizado. A tener en cuenta si la capa tiene varias instancias temporales.
* date: fecha en la que se realiza el comentario.
* email: email introducido por el usuario.
* verification_code: el código usado para verificar que la dirección de email proporcionada por el usuario está operativa. Ver :ref:`feedback_workflow`.
* language: el código del lenguaje seleccionado por el usuario en el momento de hacer el comentario. Por ejemplo "es" para español.
* state: estado en el flujo de trabajo. Uno de los siguientes:

	* 0 -> nuevo comentario. E-mail no confirmado.
	* 1 -> E-mail y comentario confirmado.
	* 2 -> Validado por un técnico.
	* 3 -> Validación notificada al usuario creador del comentario.

Comunicación
................

Para la comunicación entre usuario y técnico es necesario primero configurar la cuenta de correo que se utilizará para realizar el intercambio. Esto se hace en el portal.properties mediante las siguientes propiedades:

* feedback-mail-host. Nombre del servidor de correo. Por ejemplo ``smtp.gmail.com`` si se está utilizando una cuenta de gmail.
* feedback-mail-port. Puerto donde escucha el servidor de correo. ``587`` en el caso de gmail.
* feedback-mail-username. Cuenta de correo. Por ejemplo: ``onuredd@gmail.com``.
* feedback-mail-password. Contraseña de la cuenta de correo.

Esta cuenta de correo se utilizará para contactar con el usuario que crea un nuevo mensaje, pero además será donde se reciban las notificaciones de que un nuevo comentario ha sido creado y está a la espera de ser validado por un técnico. Este correo llevará como título y cuerpo los contenidos especificados en las dos propiedades siguientes:

* feedback-admin-mail-title. Título del correo. Por ejemplo ``Hay un nuevo comentario en el portal REDD``.
* feedback-admin-mail-text. Texto del correo. Por ejemplo ``Se ha introducido un comentario en el portal de REDD con c\u00f3digo de verificaci\u00f3n "$code``. Nótese que la variable ``$code`` se reemplazará por el identificador que se le haya asignado al comentario en el campo ``id`` de la tabla.

Por último, la notificación a los usuarios de que su comentario ha sido validado no se realiza de inmediato sino que, de forma periódica, el sistema comprueba qué comentarios han sido validados por un técnico pero no han sido notificados todavía. El tiempo de espera entre dos comprobaciones se expresa con la siguiente propiedad:
 
* feedback-validation-check-delay. Tiempo que el sistema espera antes de volver a releer la tabla de comentarios y notificar a los usuarios cuyo comentario ha sido validado por un técnico. Se expresa en milisegundos, por lo que un valor de 600000 correspondería a 10 minutos, valor recomendado.

Por último, todos los mensajes enviados al usuario se deben adaptar al idioma que habla el usuario por lo que para personalizarlos es necesario establecer una serie de propiedades en los ficheros de mensajes que se pueden encontrar en el directorio ``messages`` del directorio de configuración de la aplicación. Las propiedades con sus valores iniciales es español son:

* Feedback.all_parameters_mandatory=Todos los par\u00e1metros son obligatorios: 
* Feedback.error_sending_mail=Error enviando el correo: 
* Feedback.the_message_has_been_validated=El comentario ha sido validado.
* Feedback.comment_not_found=No se encontr\u00f3 ning\u00fan comentario con el c\u00f3digo
* Feedback.mail-title=Comentario en el portal ONU-REDD
* Feedback.verify-mail-text=Por favor, visite http://localhost:8080/unredd-portal/verify-comment?lang=$lang&verificationCode=$code para confirmar el envío.
* Feedback.validated-mail-text=El comentario con c\u00f3digo de verificaci\u00f3n "$code", ha sido validado y puede consultarse en el portal.
* Feedback.invalid-email-address=La direcci\u00f3n de correo especificada no es v\u00e1lida
* Feedback.no-geometries=Al menos se debe dibujar una geometr\u00eda
* Feedback.verify_mail_sent=Se ha enviado un mensaje a la direcci\u00f3n de correo especificada para confirmar el comentario.
* Feedback.submit_error=No se pudo realizar el env\u00edo.

.. _feedback_workflow:

Flujo de trabajo de la herramienta Feedback
---------------------------------------------

El flujo de trabajo habitual de la herramienta Feedback es el siguiente:

#. El usuario del portal abre el diálogo de feedback, dibuja una región e introduce un comentario y su dirección de e-mail y envía el formulario.
#. El sistema almacena el comentario en la tabla con ``state`` igual a 0 (nuevo). Se manda un correo al usuario con un enlace para confirmar el contenido del formulario y que la dirección de e-mail es correcta.
#. Cuando el usuario accede al enlace el sistema actualiza el campo ``state`` a 1 (confirmado) y envía un correo a la cuenta de correo configurada para que los técnicos sepan que hay un nuevo comentario en el sistema que espera a ser validado.
#. Un técnico forestal visualiza la entrada accediendo a la base de datos PostGIS, por ejemplo con QGIS, y puede opcionalmente marcar algunas entradas como validadas cambiando el valor de ``state`` a 2 (validado).
#. El sistema periódicamente comprueba los comentarios que hay en estado 2, validado pero no notificado al autor, y envía un mail automático indicándole que su comentario ha sido validado. Cuando consigue enviar este mensaje, actualiza el campo ``state`` a 3 (notificado), para no volver a procesarlo más.
#. El usuario recibe el mensaje indicándole que su entrada ha sido validada. Si se ha configurado en el portal una capa con los comentarios validados, el usuario podrá acceder al portal y ver su comentario allí.

Recomendaciones
-----------------

Una vez la funcionalidad de Feedback ha sido instalada y está en funcionamiento se recomienda:

- Configurar la cuenta de correo en el cliente de correo habitual del técnico responsable. De esta manera se evitan los olvidos y los mensajes de nuevos comentarios siempre encontrarán alguien que los lea.

- Crear una vista SQL que seleccione todos los comentarios con ``state`` igual a 2 y añadirla como capa en el portal. De esta manera, cuando el técnico valida una entrada, ésta se muestra automáticamente en el portal.

