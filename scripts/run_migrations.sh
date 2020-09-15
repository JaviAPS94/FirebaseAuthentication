#!/bin/bash

set -euo pipefail

CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

PARAM_ACTION=${1:?"Missing ACTION"}
PROJECT_NAME_IMAGE=${2:?"Missing PROJECT_NAME_IMAGE"}
MIGRATION_COMMAND=${3:?"Missing MIGRATION_COMMAND"}

ROOT_PATH="${CURRENT_PATH}/.."

##############################

PROJECT_NAME_CONTAINER_NAME=project-name-migration
NETWORK_NAME=project-name-network

##############################
function run_migrations {
  local PROJECT_NAME_CONTAINER_NAME=$1
  local PROJECT_NAME_IMAGE=$2
  local COMMAND=$3
  local NETWORK_NAME=$4

  docker container run \
    --rm \
    -i \
    --network ${NETWORK_NAME} \
    --env-file ${ROOT_PATH}/local/db-connection.env \
    --env-file ${ROOT_PATH}/local/run-migrations.env \
    -v ${ROOT_PATH}/app/src/migration:/application/src/migration/ \
    --name ${PROJECT_NAME_CONTAINER_NAME} \
    ${PROJECT_NAME_IMAGE} \
    ${COMMAND}
}
#################################

echo "[+] migration_apply"

echo "[*] ACTION=${PARAM_ACTION}"

case ${PARAM_ACTION} in
  "run")
    echo "[*] Running migration"
    run_migrations "${PROJECT_NAME_CONTAINER_NAME}" "${PROJECT_NAME_IMAGE}" "npm run typeorm migration:${MIGRATION_COMMAND}" "${NETWORK_NAME}"

    echo "[*] Finished migration"
  ;;
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac
echo "[-] migration_apply"
