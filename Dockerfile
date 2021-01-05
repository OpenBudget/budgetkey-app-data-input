FROM akariv/dgp-app:latest

# USER root

USER etl

RUN rm -rf ui
COPY configuration.json dags/
COPY ui/dist/ui ui/dist/ui
