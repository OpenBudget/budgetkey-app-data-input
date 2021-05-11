#!/bin/sh
export DOCKER_IMAGE=budgetkey/budgetkey-app-data-input
python version.py && \
(cd ui && npm run package) && \
docker pull akariv/dgp-app && \
docker build . -t $DOCKER_IMAGE --no-cache && \
docker push $DOCKER_IMAGE