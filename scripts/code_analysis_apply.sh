#!/bin/bash

set -euo pipefail

CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

PARAM_ACTION=${1:?"Missing ACTION"}

ROOT_PATH="${CURRENT_PATH}/.."

##############################

SONAR_SCANNER_IMAGE=sonarsource/sonar-scanner-cli

##############################

function run_sonar_scanner {
  local SONAR_HOST_URL=$1
  local SONAR_TOKEN=$2
  local SONAR_SCANNER_IMAGE=$3

  docker container run \
    --rm \
    -e SONAR_HOST_URL=${SONAR_HOST_URL} \
    -e SONAR_LOGIN=${SONAR_TOKEN} \
    -v ${ROOT_PATH}/app:/usr/src \
    ${SONAR_SCANNER_IMAGE}
}

#################################

echo "[+] code_analysis_apply"

echo "[*] ACTION=${PARAM_ACTION}"

case ${PARAM_ACTION} in
  "run-sonar")
    echo "Running sonar-scanner"

    SONAR_HOST_URL=${2:?"Missing SONAR_HOST_URL"}
    SONAR_TOKEN=${3:?"Missing SONAR_TOKEN"}

    run_sonar_scanner "${SONAR_HOST_URL}" "${SONAR_TOKEN}" "${SONAR_SCANNER_IMAGE}"
  ;;
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac
echo "[-] local_apply"
