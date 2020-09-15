override SOPS_KMS_ARN := 
override ASSUMED_ROLE_ARN := 

ECR_REPOSITORY ?= 
PROJECT-NAME_REPOSITORY_NAME ?= ecommerce-project-name
AWS_REGION ?= 
SONAR_HOST_URL ?= 

.PHONY: create-secret
create-secret:
	@./scripts/secrets_apply.sh "create" "${SOPS_KMS_ARN}" ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY} ${ASSUMED_ROLE_ARN} ${SECRET_FILE_PATH}

.PHONY: decrypt-secret
decrypt-secret:
	@./scripts/secrets_apply.sh "decrypt" ${SOPS_KMS_ARN} ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY} ${ASSUMED_ROLE_ARN} ${SECRET_FILE_PATH}

.PHONY: update-secret
update-secret:
	@./scripts/secrets_apply.sh "update" ${SOPS_KMS_ARN} ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY} ${ASSUMED_ROLE_ARN} ${SECRET_FILE_PATH}

docker-build-project-name:
	@./scripts/docker_apply.sh "build" ${ECR_REPOSITORY} ${PROJECT-NAME_REPOSITORY_NAME} "docker/Dockerfile"

docker-export-project-name:
	@./scripts/docker_apply.sh "export" ${ECR_REPOSITORY} ${PROJECT-NAME_REPOSITORY_NAME}

docker-import-project-name:
	@./scripts/docker_apply.sh "import" ${INPUTFILE_PATH}

docker-login:
	@./scripts/docker_apply.sh "login" $(ECR_REPOSITORY) $(AWS_REGION) $(AWS_ACCESS_KEY_ID) $(AWS_SECRET_ACCESS_KEY)

docker-package-project-name:
	@./scripts/docker_apply.sh "package" $(ECR_REPOSITORY) ${PROJECT-NAME_REPOSITORY_NAME} $(VERSION)

docker-publish-project-name:
	@./scripts/docker_apply.sh "publish" $(ECR_REPOSITORY) ${PROJECT-NAME_REPOSITORY_NAME} $(VERSION)

local-run:
	@./scripts/local_apply.sh "run" "${ECR_REPOSITORY}/${PROJECT-NAME_REPOSITORY_NAME}:${VERSION}"

local-run-db:
	@./scripts/local_apply.sh "run-db"

local-stop:
	@./scripts/local_apply.sh "stop"

create-migration:
	@./scripts/run_migrations.sh "run" "${ECR_REPOSITORY}/${PROJECT-NAME_REPOSITORY_NAME}:${VERSION}" "generate -- -n ${FILENAME}"

run-migration:
	@./scripts/run_migrations.sh "run" "${ECR_REPOSITORY}/${PROJECT-NAME_REPOSITORY_NAME}:${VERSION}" "run"

run-code-analysis:
	@./scripts/code_analysis_apply.sh "run-sonar" "${SONAR_HOST_URL}" "${SONAR_TOKEN}"

run-unit-tests:
	@./scripts/test_apply.sh "run-unit" "${ECR_REPOSITORY}/${PROJECT-NAME_REPOSITORY_NAME}:${VERSION}"

run-e2e-tests:
	@./scripts/test_apply.sh "run-e2e" "${ECR_REPOSITORY}/${PROJECT-NAME_REPOSITORY_NAME}:${VERSION}"
