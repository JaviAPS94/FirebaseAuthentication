#!/bin/bash

# unofficial bash strict mode
set -euo pipefail

# run from any directory (no symlink allowed)
CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

PARAM_ACTION=${1:?"Missing ACTION"}
SOPS_KMS_ARN=${2:?"Missing SOPS_KMS_ARN"}
AWS_ACCESS_KEY_ID=${3:?"Missing AWS_ACCESS_KEY_ID"}
AWS_SECRET_ACCESS_KEY=${4:?"Missing AWS_SECRET_ACCESS_KEY"}
ASSUMED_ROLE_ARN=${5:?"Missing ASSUMED_ROLE_ARN"}
SECRET_FILE_PATH=${6:?"Missing SECRET_FILE_PATH"}

ROOT_PATH="${CURRENT_PATH}/.."

##############################

SOPS_IMAGE=mozilla/sops:4bc27f6eb72b1b4090753e9f3dba1d094544e1c3

function run_sops_tty {
  local ACTION=$1

  docker container run \
    --rm \
    -it \
    -v ${ROOT_PATH}/:/src \
    -e SOPS_KMS_ARN="${SOPS_KMS_ARN},${SOPS_KMS_ARN}+${ASSUMED_ROLE_ARN}"\
    -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    -w /src \
    ${SOPS_IMAGE} \
    ${ACTION}
}

function run_sops {
  local ACTION=$1

  docker container run \
    --rm \
    -v ${ROOT_PATH}/:/src \
    -e SOPS_KMS_ARN="${SOPS_KMS_ARN},${SOPS_KMS_ARN}+${ASSUMED_ROLE_ARN}"\
    -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    -w /src \
    ${SOPS_IMAGE} \
    ${ACTION}
}

##############################

echo "[+] secrets_apply"

echo "[*] ACTION=${PARAM_ACTION}"

case ${PARAM_ACTION} in
  "create")
    echo "[*] encrypting secret file ..."

    run_sops "sops -e ${SECRET_FILE_PATH}" > "${ROOT_PATH}/${SECRET_FILE_PATH}.enc"

    echo "[*] file encrypted with success!"
  ;;
  "update")
    echo "[*] updating already existing secret file ..."

    run_sops_tty "sops ${SECRET_FILE_PATH}"

    echo "[*] secret update done!"
  ;;
  "decrypt")
    echo "[*] decrypting secret file ..."

    DECRYPTED_FILE=$(echo "${SECRET_FILE_PATH}" | cut -f 2 -d '.')
    run_sops "sops -d --input-type dotenv --output-type dotenv ${SECRET_FILE_PATH}" > "${ROOT_PATH}/${DECRYPTED_FILE}.env"

    echo "[*] file decrypted with success!"
  ;;
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac

echo "[-] secrets_apply"
