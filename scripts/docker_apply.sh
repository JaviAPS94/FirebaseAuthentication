#!/bin/bash

# unofficial bash strict mode
set -euo pipefail

# run from any directory (no symlink allowed)
CURRENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd ${CURRENT_PATH}

##############################

ACTION=${1:?"Missing ACTION"}
ROOT_PATH="${CURRENT_PATH}/.."

##############################
AWSCLI_IMAGE=amazon/aws-cli:2.0.31

function run_aws {
  local AWS_ACCESS_KEY_ID=${1:?"Missing AWS_ACCESS_KEY_ID"}
  local AWS_SECRET_ACCESS_KEY=${2:?"Missing AWS_SECRET_ACCESS_KEY"}
  local ACTION=${3:?"Missing ACTION"}

  docker container run \
    --rm \
    -i \
    -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    ${AWSCLI_IMAGE} \
    ${ACTION}
}

##############################

echo "[+] docker_apply"

echo "[*] ACTION=${ACTION}"

case ${ACTION} in
  "build")
    echo "Building image"
    ECR_REPOSITORY=${2:?"Missing ECR_REPOSITORY"}
    REPOSITORY_NAME=${3:?"Missing REPOSITORY_NAME"}
    DOCKERFILE_PATH=${4:?"Missing DOCKERFILE_PATH"}

    cd ${ROOT_PATH}
    docker build -t "${ECR_REPOSITORY}/${REPOSITORY_NAME}:latest" -f "${DOCKERFILE_PATH}" .
  ;;
  "export")
    ECR_REPOSITORY=${2:?"Missing ECR_REPOSITORY"}
    REPOSITORY_NAME=${3:?"Missing REPOSITORY_NAME"}

    docker save --output "${ROOT_PATH}/${REPOSITORY_NAME}.docker" "${ECR_REPOSITORY}/${REPOSITORY_NAME}:latest"
  ;;
  "import")
    INPUTFILE_PATH=${2:?"Missing INPUTFILE_PATH"}

    docker load --input ${INPUTFILE_PATH}
  ;;
  "login")
    ECR_REPOSITORY=${2:?"Missing ECR_REPOSITORY"}
    AWS_REGION=${3:?"Missing AWS_REGION"}
    AWS_ACCESS_KEY_ID=${4:?"Missing AWS_ACCESS_KEY_ID"}
    AWS_SECRET_ACCESS_KEY=${5:?"Missing AWS_SECRET_ACCESS_KEY"}

    run_aws "${AWS_ACCESS_KEY_ID}" "${AWS_SECRET_ACCESS_KEY}" "ecr get-login-password --region ${AWS_REGION}" | docker login --username AWS --password-stdin ${ECR_REPOSITORY}
  ;;
  "package")
    ECR_REPOSITORY=${2:?"Missing ECR_REPOSITORY"}
    REPOSITORY_NAME=${3:?"Missing REPOSITORY_NAME"}
    VERSION=${4:?"Missing VERSION"}

    docker tag "${ECR_REPOSITORY}/${REPOSITORY_NAME}:latest" "${ECR_REPOSITORY}/${REPOSITORY_NAME}:${VERSION}"
  ;;
  "publish")
    ECR_REPOSITORY=${2:?"Missing ECR_REPOSITORY"}
    REPOSITORY_NAME=${3:?"Missing REPOSITORY_NAME"}
    VERSION=${4:?"Missing VERSION"}

    docker push "${ECR_REPOSITORY}/${REPOSITORY_NAME}:${VERSION}"
    docker push "${ECR_REPOSITORY}/${REPOSITORY_NAME}:latest"
  ;;
  *)
    echo "ERROR: unknown command"
    exit 1
  ;;
esac

echo "[-] docker_apply"
