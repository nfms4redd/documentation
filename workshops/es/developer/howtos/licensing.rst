Cómo dar licencia libre a un plugin 
====================================

Una vez hemos realizado nuestro plugin y tenemos claro que queremos publicarlo con una licencia para que la gente lo reutilice de forma libre, tenemos que seguir los siguientes pasos:

#. Elegir una licencia libre
#. Aplicar la licencia a nuestro proyecto

Elegir una licencia libre
----------------------------

Existen muchísimas licencias de software libre por lo que para este tutorial nos limitaremos al ámbito de las más utilizadas. Además, para facilitar la aplicación de la licencia nos limitaremos también a las soportadas por el ``maven-license-plugin``.

Para obtener un listado de las licencias basta con ejecutar el objetivo ``license-list`` del plugin Maven ``license``::

	$ mvn license:license-list
	[INFO] Scanning for projects...
	[INFO]                                                                         
	[INFO] ------------------------------------------------------------------------
	[INFO] Building Maven Stub Project (No POM) 1
	[INFO] ------------------------------------------------------------------------
	[INFO] 
	[INFO] --- license-maven-plugin:1.8:license-list (default-cli) @ standalone-pom ---
	[WARNING] File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!
	[INFO] Available licenses :
	
	 * agpl_v3     : GNU Affero General Public License (AGPL) version 3.0
	 * apache_v2   : Apache License version 2.0
	 * bsd_2       : BSD 2-Clause License
	 * bsd_3       : BSD 3-Clause License
	 * cddl_v1     : COMMON DEVELOPMENT AND DISTRIBUTION LICENSE (CDDL) Version 1.0
	 * epl_only_v1 : Eclipse Public License - v 1.0
	 * epl_v1      : Eclipse Public + Distribution License - v 1.0
	 * eupl_v1_1   : European Union Public License v1.1
	 * fdl_v1_3    : GNU Free Documentation License (FDL) version 1.3
	 * gpl_v1      : GNU General Public License (GPL) version 1.0
	 * gpl_v2      : GNU General Public License (GPL) version 2.0
	 * gpl_v3      : GNU General Public License (GPL) version 3.0
	 * lgpl_v2_1   : GNU General Lesser Public License (LGPL) version 2.1
	 * lgpl_v3     : GNU General Lesser Public License (LGPL) version 3.0
	 * mit         : MIT-License
	
	[INFO] ------------------------------------------------------------------------
	[INFO] BUILD SUCCESS
	[INFO] ------------------------------------------------------------------------
	[INFO] Total time: 2.228s
	[INFO] Finished at: Thu Mar 05 06:46:17 CET 2015
	[INFO] Final Memory: 10M/144M
	[INFO] ------------------------------------------------------------------------

Cada licencia tiene unas particularidades, pero está fuera del ámbito de este tutorial analizar estas diferencias. Para el siguiente punto, aplicaremos a nuestro proyecto la licencia GPLv3 (GNU General Public License (GPL) version 3.0), que es la misma que tiene el portal de FAO.

Aplicar la licencia a nuestro proyecto
------------------------------------------------------------------------

Ahora que tenemos nuestro proyecto y sabemos la licencia que queremos que tenga, GPLv3, ¿cómo se la aplicamos?

Para aplicar esta licencia tenemos que incluir en la raíz de nuestro proyecto un fichero LICENSE.txt con el texto de la licencia y en cada fichero de código, una cabecera similar a la siguiente::

	/*
	 * NOMBRE DEL PROYECTO
	 * 
	 * Copyright (C) AÑO ORGANIZACIÓN
	 * 
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as
	 * published by the Free Software Foundation, either version 3 of the
	 * License, or (at your option) any later version.
	 * 
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 * 
	 * You should have received a copy of the GNU General Public
	 * License along with this program.  If not, see
	 * <http://www.gnu.org/licenses/gpl-3.0.html>.
	 * 
	 */

Esto, que sería bastante tedioso de realizar a mano, lo hace de forma automática el plugin ``license`` de Maven, pero para que pueda llevar estas acciones a cabo es necesario configurarlo en el ``pom.xml`` con los datos propios de nuestro proyecto, que se usarán para personalizar el texto de la cabecera.

Vamos a suponer que partimos de un pom.xml tan sencillo como éste:

.. code-block:: xml

	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	  <modelVersion>4.0.0</modelVersion>
	
	  <groupId>mi.organizacion</groupId>
	  <artifactId>pluginParaX</artifactId>
	  <version>1.0-SNAPSHOT</version>
	  <packaging>jar</packaging>
	
	  <name>PluginParaX</name>
	  <url>http://maven.apache.org</url>
	
	  <properties>
	    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	  </properties>
	
	  <dependencies>
	    <dependency>
	      <groupId>junit</groupId>
	      <artifactId>junit</artifactId>
	      <version>3.8.1</version>
	      <scope>test</scope>
	    </dependency>
	  </dependencies>
	</project>

Para configurar nuestro plugin tendremos que añadir una sección ``build/plugins``, dentro de la cual pondremos la configuración del plugin ``license``:

.. code-block:: xml

	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	  <modelVersion>4.0.0</modelVersion>
	
	  <groupId>mi.organizacion</groupId>
	  <artifactId>pluginParaX</artifactId>
	  <version>1.0-SNAPSHOT</version>
	  <packaging>jar</packaging>
	
	  <name>PluginParaX</name>
	  <url>http://maven.apache.org</url>
	
	  <properties>
	    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	  </properties>
	
	  <dependencies>
	    <dependency>
	      <groupId>junit</groupId>
	      <artifactId>junit</artifactId>
	      <version>3.8.1</version>
	      <scope>test</scope>
	    </dependency>
	  </dependencies>
	  <build>
	    <plugins>
	      <!-- Aquí va la configuración del plugin license -->
	    </plugins>
	  </build>
	</project>

Para la configuración del plugin usaremos algo similar a este elemento ``plugin``. Nótese que en un fichero XML, los símbolos ``<!--`` y ``-->`` sirven para abrir y cerrar comentarios:

.. code-block:: xml

	<plugin>
	  <!-- Identificación del plugin license -->
	  <groupId>org.codehaus.mojo</groupId>
	  <artifactId>license-maven-plugin</artifactId>
	  <!-- Configuración para el plugin anterior -->
	  <configuration>
	    <!-- Año en el que se publica el plugin -->
	    <inceptionYear>2015</inceptionYear>
	    <!-- Organización que publica el código -->
	    <organizationName>FAO</organizationName>
	    <!-- Nombre del proyecto como aparecerá en la licencia -->
	    <projectName>PluginParaX</projectName>
	    <!-- licencia escogida de la lista del punto anterior -->
	    <licenseName>gpl_v3</licenseName>
	    <!--
	    directorios donde se encuentran los ficheros de código
	    cuya cabecera queremos editar
	    -->
	    <roots>
	      <root>src/main/java</root>
	      <root>src/main/resources/nfms/modules</root>
	      <root>src/main/resources/nfms/styles</root>
	    </roots>
	    <!-- 
	    Patrones que indentifican los ficheros cuya cabecera
	    queremos editar en los directorios especificados por
	    "roots"
	    -->
	    <includes>
	      <include>*.java</include>
	      <include>*.js</include>
	      <include>*.css</include>
	    </includes>
	  </configuration>
	</plugin>

Finalmente, insertando el elemento ``plugin`` anterior en el ``pom.xml``, el fichero quedaría de la siguiente manera:

.. code-block:: xml

	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	  <modelVersion>4.0.0</modelVersion>
	
	  <groupId>mi.organizacion</groupId>
	  <artifactId>pluginParaX</artifactId>
	  <version>1.0-SNAPSHOT</version>
	  <packaging>jar</packaging>
	
	  <name>PluginParaX</name>
	  <url>http://maven.apache.org</url>
	
	  <properties>
	    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	  </properties>
	
	  <dependencies>
	    <dependency>
	      <groupId>junit</groupId>
	      <artifactId>junit</artifactId>
	      <version>3.8.1</version>
	      <scope>test</scope>
	    </dependency>
	  </dependencies>
	  <build>
	    <plugins>
	      <plugin>
	        <!-- Identificación del plugin license -->
	        <groupId>org.codehaus.mojo</groupId>
	        <artifactId>license-maven-plugin</artifactId>
	        <!-- Configuración para el plugin anterior -->
	        <configuration>
	          <!-- Año en el que se publica el plugin -->
	          <inceptionYear>2015</inceptionYear>
	          <!-- Organización que publica el código -->
	          <organizationName>FAO</organizationName>
	          <!-- Nombre del proyecto como aparecerá en la licencia -->
	          <projectName>PluginParaX</projectName>
	          <!-- licencia escogida de la lista del punto anterior -->
	          <licenseName>gpl_v3</licenseName>
	          <!--
	          directorios donde se encuentran los ficheros de código
	          cuya cabecera queremos editar. Especificaremos los
	          directorios donde se encuentran los ficheros Java y
	          los módulos Javascript.
	          -->
	          <roots>
	            <root>src/main/java</root>
	            <root>src/main/resources/nfms/modules</root>
	            <root>src/main/resources/nfms/styles</root>
	          </roots>
	          <!-- 
	          Patrones que indentifican los ficheros cuya cabecera
	          queremos editar en los directorios especificados por
	          "roots". Especificaremos ficheros Java, Javascript y
	          las hojas de estilo CSS. 
	          -->
	          <includes>
	            <include>*.java</include>
	            <include>*.js</include>
	            <include>*.css</include>
	          </includes>
	        </configuration>
	      </plugin>
	    </plugins>
	  </build>
	</project>

Una vez la configuración está realizada, ya sólo queda realizar las dos acciones necesarias: añadir el texto de la licencia y las cabeceras. Para añadir la licencia podemos ejecutar el objetivo ``update-project-license``::

	$ mvn license:update-project-license
	[INFO] Scanning for projects...
	[WARNING] 
	[WARNING] Some problems were encountered while building the effective model for mi.organizacion:pluginParaX:jar:1.0-SNAPSHOT
	[WARNING] 'build.plugins.plugin.version' for org.codehaus.mojo:license-maven-plugin is missing. @ line 27, column 15
	[WARNING] 
	[WARNING] It is highly recommended to fix these problems because they threaten the stability of your build.
	[WARNING] 
	[WARNING] For this reason, future Maven versions might no longer support building such malformed projects.
	[WARNING] 
	[INFO]                                                                         
	[INFO] ------------------------------------------------------------------------
	[INFO] Building PluginParaX 1.0-SNAPSHOT
	[INFO] ------------------------------------------------------------------------
	[INFO] 
	[INFO] --- license-maven-plugin:1.8:update-project-license (default-cli) @ PluginParaX ---
	[INFO] Will create or update license file [gpl_v3] to /tmp/pluginParaX/LICENSE.txt
	[INFO] ------------------------------------------------------------------------
	[INFO] BUILD SUCCESS
	[INFO] ------------------------------------------------------------------------
	[INFO] Total time: 1.738s
	[INFO] Finished at: Thu Mar 05 08:48:02 CET 2015
	[INFO] Final Memory: 9M/144M
	[INFO] ------------------------------------------------------------------------
	
que añadirá el fichero LICENSE.txt en la raíz del proyecto.

Y por último, para añadir las cabeceras, usaremos el objetivo ``update-file-header``::

	$ mvn license:update-file-header
	[INFO] Scanning for projects...
	[WARNING] 
	[WARNING] Some problems were encountered while building the effective model for mi.organizacion:PluginParaX:jar:1.0-SNAPSHOT
	[WARNING] 'build.plugins.plugin.version' for org.codehaus.mojo:license-maven-plugin is missing. @ line 27, column 15
	[WARNING] 
	[WARNING] It is highly recommended to fix these problems because they threaten the stability of your build.
	[WARNING] 
	[WARNING] For this reason, future Maven versions might no longer support building such malformed projects.
	[WARNING] 
	[INFO]                                                                         
	[INFO] ------------------------------------------------------------------------
	[INFO] Building PluginParaX 1.0-SNAPSHOT
	[INFO] ------------------------------------------------------------------------
	[INFO] 
	[INFO] --- license-maven-plugin:1.8:update-file-header (default-cli) @ PluginParaX ---
	[INFO] Will search files to update from root /tmp/pluginParaX/src/main/java
	[INFO] Will search files to update from root /tmp/pluginParaX/src/main/resources/nfms/modules
	[INFO] Scan 4 files header done in 27.798ms.
	[INFO] 
	 * add header on 4 files.
	[INFO] ------------------------------------------------------------------------
	[INFO] BUILD SUCCESS
	[INFO] ------------------------------------------------------------------------
	[INFO] Total time: 1.874s
	[INFO] Finished at: Thu Mar 05 08:50:36 CET 2015
	[INFO] Final Memory: 10M/144M
	[INFO] ------------------------------------------------------------------------

Por último, sólo nos queda poner nuestro plugin en un lugar accesible para que lo puedan encontrar otros desarrolladores.