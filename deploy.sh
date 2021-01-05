#!/bin/sh
export DOCKER_IMAGE=budgetkey/budgetkey-app-data-input
(cd ui && npm run package) && \
docker build . -t $DOCKER_IMAGE && \
docker push $DOCKER_IMAGE