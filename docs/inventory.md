Lo primero que deberemos hacer, antes de empezar a instalar el sistema, será hacer un listado de los datos a publicar. Por cada capa que vayamos a publicar, deberemos indicar:

- **Formato**: GeoTIFF, ECW, SHP, etc.
- **Tamaño** (aproximado): 1MB, 10MB, 100MB, 1GB, 10GB, etc.
- **Periodicidad de la actualización**: Diario, mensual, anual, cada *n* años, etc..
- **Instancias temporales** (si las tiene):
    * 2005, 2007, 2011
    * Diario desde 2002.
    * ...
- **Leyenda** (si se debe publicar con una leyenda específica): formato en que se puede exportar la leyenda (SLD, QGIS, ArcMap, etc.).

Ejemplos:

* Ortofotos
	* Formato: GeoTIFF
	* Tamaño: 60MB
	* Periodicidad de la actualización: cada dos años.
	* Número de instancias temporales: 2012, 2014, 2016, 2018.
	* Leyenda: (ninguno)
* Límites administrativos
	* Formato: SHP
	* Tamaño: 10MB
	* Periodicidad de la actualización: nunca.
	* Instancias temporales: (ninguna).
	* Leyenda: Fichero SLD

