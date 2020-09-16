#!/bin/bash

set -euo pipefail

CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

PARAM_ACTION=${1:?"Missing ACTION"}
AUTHENTICATION_V2_IMAGE=${2:?"Missing AUTHENTICATION_V2_IMAGE"}

ROOT_PATH="${CURRENT_PATH}/.."

##############################

AUTHENTICATION_V2_CONTAINER_NAME=authentication-v2-test
NETWORK_NAME=testing-network
DB_CONTAINER_NAME=db-test
MYSQL_IMAGE=mysql:5.7

##############################
function run_tests {
  local AUTHENTICATION_V2_CONTAINER_NAME=$1
  local AUTHENTICATION_V2_IMAGE=$2
  local COMMAND=$3

  docker container run \
    --rm \
    -i \
    --network ${NETWORK_NAME} \
    -v ${ROOT_PATH}/app/coverage:/application/coverage/ \
    -v ${ROOT_PATH}/app/test:/application/test/ \
    --name ${AUTHENTICATION_V2_CONTAINER_NAME} \
    ${AUTHENTICATION_V2_IMAGE} \
    ${COMMAND}
}

function run_db {
  local NETWORK_NAME=$1
  local DB_CONTAINER_NAME=$2
  local MYSQL_IMAGE=$3

  docker container run -d \
  --rm \
  --network ${NETWORK_NAME} \
  --name ${DB_CONTAINER_NAME} \
  -e MYSQL_DATABASE=e2e-test \
  -e MYSQL_USER=test \
  -e MYSQL_ROOT_PASSWORD=test \
  -e MYSQL_PASSWORD=test \
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

echo "[+] test_apply"

echo "[*] ACTION=${PARAM_ACTION}"

case ${PARAM_ACTION} in
  "run-unit")
    echo "[*] Running unit tests"
    create_network "${NETWORK_NAME}"
    run_tests "${AUTHENTICATION_V2_CONTAINER_NAME}" "${AUTHENTICATION_V2_IMAGE}" "npm test"

    echo "[*] Finished unit tests"
  ;;
  "run-e2e")
    echo "[*] Running e2e tests"
    create_network "${NETWORK_NAME}"
    run_db "${NETWORK_NAME}" "${DB_CONTAINER_NAME}" "${MYSQL_IMAGE}"
    sleep 10
    run_tests "${AUTHENTICATION_V2_CONTAINER_NAME}" "${AUTHENTICATION_V2_IMAGE}" "npm run test:e2e"
    docker stop ${DB_CONTAINER_NAME}

    echo "[*] Finished e2e tests"
    ;;
    
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac
echo "[-] test_apply"
