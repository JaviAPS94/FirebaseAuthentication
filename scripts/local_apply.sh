#!/bin/bash

set -euo pipefail

CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

PARAM_ACTION=${1:?"Missing ACTION"}

ROOT_PATH="${CURRENT_PATH}/.."

##############################

MS_AUTHENTICATION_CONTAINER_NAME=ms-authentication
DB_CONTAINER_NAME=db
MYSQL_IMAGE=mysql:5.7
NETWORK_NAME=ms-authentication-network

##############################
function run_ms_authentication {
  local NETWORK_NAME=$1
  local MS_AUTHENTICATION_CONTAINER_NAME=$2
  local MS_AUTHENTICATION_IMAGE=$3

  docker container run -d \
    --rm \
    -p 3000:3000 \
    --network ${NETWORK_NAME} \
    --env-file ${ROOT_PATH}/local/db-connection.env \
    --env-file ${ROOT_PATH}/local/run-app.env \
    --name ${MS_AUTHENTICATION_CONTAINER_NAME} \
    ${MS_AUTHENTICATION_IMAGE}
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
    MS_AUTHENTICATION_IMAGE=${2:?"Missing MS_AUTHENTICATION_IMAGE"}

    create_network "${NETWORK_NAME}"
    run_ms_authentication "${NETWORK_NAME}" "${MS_AUTHENTICATION_CONTAINER_NAME}" "${MS_AUTHENTICATION_IMAGE}"
  ;;
  "run-db")
    create_network "${NETWORK_NAME}"
    run_db "${NETWORK_NAME}" "${DB_CONTAINER_NAME}" "${MYSQL_IMAGE}"
  ;;
  "stop")
    docker stop ${MS_AUTHENTICATION_CONTAINER_NAME} ${DB_CONTAINER_NAME}
  ;;
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac
echo "[-] local_apply"