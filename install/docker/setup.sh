#!/bin/bash

set -e

installDir="/var/nfms"
name="portal"
user="admin"
pass="admin"

VERSION="7.0.0-SNAPSHOT"
USAGE="Uso: $0 [-d directorio] [-a aplicación] [-n nombre] [-u usuario] [-p password] [-h]"
HELP="${USAGE}

Opciones:
  - d <directorio> Directorio a usar para la instalación del sistema.
                   Por defecto ${installDir}.
  - a <aplicación> Aplicación (.war) a utilizar.
                   Por defecto: aplicación demo, versión ${VERSION}.
  - n <nombre>     Nombre a utilizar por la aplicación. Se utilizará para
                   la ruta en la que se accede al portal.
                   Por defecto: portal (http://localhost/portal).
  - u <usuario>    Nombre del usuario para la base de datos.
                   Por defecto: admin.
  - p <password>   Contraseña para el usuario de la base de datos.
                   Por defecto: admin.
  - h              Muestra esta ayuda.
"

while getopts ":hd:a:n:u:p:" opt; do
  case $opt in
    h)
      echo "$HELP"
      exit 0
      ;;
    d)
      installDir=$OPTARG
      ;;
    a)
      app=$OPTARG
      ;;
    n)
      name=$OPTARG
      ;;
    u)
      user=$OPTARG
      ;;
    p)
      pass=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done


if [ -e "${installDir}" ]; then
  echo "El directorio ${installDir} ya existe"
  exit 1
fi

echo "Creando directorios..."
mkdir -p ${installDir}/geoserver
mkdir -p ${installDir}/geoladris

echo "Descargando recursos..."
wget -q https://nfms4redd.github.io/documentation/install/docker/docker-compose.yml -O ${installDir}/docker-compose.yml
wget -q https://nfms4redd.github.io/documentation/install/docker/httpd.conf -O ${installDir}/httpd.conf
wget -q https://nfms4redd.github.io/documentation/install/docker/proxy-http.conf -O ${installDir}/proxy-http.conf
wget -q https://nfms4redd.github.io/documentation/install/docker/context.xml -O ${installDir}/context.xml
if [ -z "${app}" ]; then
  wget -q "https://oss.sonatype.org/content/repositories/snapshots/com/github/geoladris/apps/demo/${VERSION}/demo-7.0.0-20180115.121345-1.war" -O ${installDir}/${name}.war
else
  cp ${app} ${installDir}/${name}.war
fi

unzip -q ${installDir}/${name}.war WEB-INF/default_config/*
mv WEB-INF/default_config ${installDir}/geoladris/${name}
rm -r WEB-INF

echo "Configurando..."
function addToBashrc { 
  grep "$1" ~/.bashrc > /dev/null || echo "export $1=$2" >> ~/.bashrc
  export $1=$2
}
addToBashrc "GEOSERVER_DATA_DIR" "${installDir}/geoserver"
addToBashrc "GEOLADRIS_CONFIG_DIR" "${installDir}/geoladris"
addToBashrc "GEOLADRIS_APP_NAME" "${name}"
addToBashrc "DB_USER" "${user}"
addToBashrc "DB_PASS" "${pass}"
sed -i "s/__app__/${GEOLADRIS_APP_NAME}/g" ${installDir}/proxy-http.conf

echo "Arrancando..."
pushd ${installDir} > /dev/null
docker-compose up -d
popd > /dev/null

echo "Hecho."

