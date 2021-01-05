#!/bin/bash
git pull
docker pull akariv/dgp-app:latest
docker-compose up --build -d
docker system prune -a