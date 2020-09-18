#!/bin/bash

set -euo pipefail

CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

PARAM_ACTION=${1:?"Missing ACTION"}

ROOT_PATH="${CURRENT_PATH}/.."

##############################

AUTHENTICATION_CONTAINER_NAME=authentication
DB_CONTAINER_NAME=db
MYSQL_IMAGE=mysql:5.7
NETWORK_NAME=authentication-network

##############################
function run_authentication {
  local NETWORK_NAME=$1
  local AUTHENTICATION_CONTAINER_NAME=$2
  local AUTHENTICATION_IMAGE=$3

  docker container run -d \
    --rm \
    -p 3000:3000 \
    --network ${NETWORK_NAME} \
    --env-file ${ROOT_PATH}/local/db-connection.env \
    --env-file ${ROOT_PATH}/local/run-app.env \
    --name ${AUTHENTICATION_CONTAINER_NAME} \
    ${AUTHENTICATION_IMAGE}
}

function run_db {
  local NETWORK_NAME=$1
  local DB_CONTAINER_NAME=$2
  local MYSQL_IMAGE=$3

  docker container run -d \
  --rm \
  --network ${NETWORK_NAME} \
  --name ${DB_CONTAINER_NAME} \
  -p 3306:3306 \
  --env-file ${ROOT_PATH}/local/db-secrets.env \
  --env-file ${ROOT_PATH}/local/db-config.env \
  ${MYSQL_IMAGE}

}

function create_network {
  local NETWORK_NAME=$1

  if ! (docker network ls | grep ${NETWORK_NAME})
    then
      echo "- Creating docker network"
      docker network create ${NETWORK_NAME}
    fi
}

#################################

echo "[+] local_apply"

echo "[*] ACTION=${PARAM_ACTION}"

case ${PARAM_ACTION} in
  "run")
    AUTHENTICATION_IMAGE=${2:?"Missing AUTHENTICATION_IMAGE"}

    create_network "${NETWORK_NAME}"
    run_authentication "${NETWORK_NAME}" "${AUTHENTICATION_CONTAINER_NAME}" "${AUTHENTICATION_IMAGE}"
  ;;
  "run-db")
    create_network "${NETWORK_NAME}"
    run_db "${NETWORK_NAME}" "${DB_CONTAINER_NAME}" "${MYSQL_IMAGE}"
  ;;
  "stop")
    docker stop ${AUTHENTICATION_CONTAINER_NAME} ${DB_CONTAINER_NAME}
  ;;
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac
echo "[-] local_apply"