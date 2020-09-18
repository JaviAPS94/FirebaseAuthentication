override SOPS_KMS_ARN := arn:aws:kms:us-east-1:224234462137:key/6a7527ea-a44c-4267-ab7e-7a3d225f5773
override ASSUMED_ROLE_ARN := arn:aws:iam::224234462137:role/ecommerce-k8s-manager

ECR_REPOSITORY ?= 224234462137.dkr.ecr.us-east-1.amazonaws.com
AUTHENTICATION_REPOSITORY_NAME ?= ecommerce-ms-authentication
AWS_REGION ?= us-east-1
SONAR_HOST_URL ?= "https://sonar-tradeteam-prod-1.k8s.staging-redbrand.com/"

.PHONY: create-secret
create-secret:
	@./scripts/secrets_apply.sh "create" "${SOPS_KMS_ARN}" ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY} ${ASSUMED_ROLE_ARN} ${SECRET_FILE_PATH}

.PHONY: decrypt-secret
decrypt-secret:
	@./scripts/secrets_apply.sh "decrypt" ${SOPS_KMS_ARN} ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY} ${ASSUMED_ROLE_ARN} ${SECRET_FILE_PATH}

.PHONY: update-secret
update-secret:
	@./scripts/secrets_apply.sh "update" ${SOPS_KMS_ARN} ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY} ${ASSUMED_ROLE_ARN} ${SECRET_FILE_PATH}

docker-build-authentication:
	@./scripts/docker_apply.sh "build" ${ECR_REPOSITORY} ${AUTHENTICATION_REPOSITORY_NAME} "docker/Dockerfile"

docker-export-authentication:
	@./scripts/docker_apply.sh "export" ${ECR_REPOSITORY} ${AUTHENTICATION_REPOSITORY_NAME}

docker-import-authentication:
	@./scripts/docker_apply.sh "import" ${INPUTFILE_PATH}

docker-login:
	@./scripts/docker_apply.sh "login" $(ECR_REPOSITORY) $(AWS_REGION) $(AWS_ACCESS_KEY_ID) $(AWS_SECRET_ACCESS_KEY)

docker-package-authentication:
	@./scripts/docker_apply.sh "package" $(ECR_REPOSITORY) ${AUTHENTICATION_REPOSITORY_NAME} $(VERSION)

docker-publish-authentication:
	@./scripts/docker_apply.sh "publish" $(ECR_REPOSITORY) ${AUTHENTICATION_REPOSITORY_NAME} $(VERSION)

local-run:
	@./scripts/local_apply.sh "run" "${ECR_REPOSITORY}/${AUTHENTICATION_REPOSITORY_NAME}:${VERSION}"

local-run-db:
	@./scripts/local_apply.sh "run-db"

local-stop:
	@./scripts/local_apply.sh "stop"

create-migration:
	@./scripts/run_migrations.sh "run" "${ECR_REPOSITORY}/${AUTHENTICATION_REPOSITORY_NAME}:${VERSION}" "generate -- -n ${FILENAME}"

run-migration:
	@./scripts/run_migrations.sh "run" "${ECR_REPOSITORY}/${AUTHENTICATION_REPOSITORY_NAME}:${VERSION}" "run"

run-code-analysis:
	@./scripts/code_analysis_apply.sh "run-sonar" "${SONAR_HOST_URL}" "${SONAR_TOKEN}"

run-unit-tests:
	@./scripts/test_apply.sh "run-unit" "${ECR_REPOSITORY}/${AUTHENTICATION_REPOSITORY_NAME}:${VERSION}"

run-e2e-tests:
	@./scripts/test_apply.sh "run-e2e" "${ECR_REPOSITORY}/${AUTHENTICATION_REPOSITORY_NAME}:${VERSION}"
