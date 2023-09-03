FROM akariv/dgp-app:latest

# USER root

USER etl

RUN pip install dataflows-airtable

RUN rm -rf ui
COPY configuration.json dags/
COPY ui/dist/ui ui/dist/ui

COPY server_extra.py .
