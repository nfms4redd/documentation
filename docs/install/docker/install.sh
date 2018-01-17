#!/bin/bash

if [ `id -u` != "0" ]; then
  echo "El script se tiene que ejecutar como root:"
  echo "$ sudo $0"
  exit 1
fi

echo "********************************"
echo "** Instalando dependencias... **"
echo "********************************"
apt-get -q update
apt-get -q -y install apt-transport-https ca-certificates curl software-properties-common

echo "**************************"
echo "** Instalando Docker... **"
echo "**************************"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get -q update
apt-get -q -y install docker-ce

curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

