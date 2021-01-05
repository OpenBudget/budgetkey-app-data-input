from akariv/dgp-app@sha256:d20485693e0f6acfd8498a641a5fd62f99ccf14dd3a31035a8fb363a56133b03

# USER root

USER etl

RUN rm -rf ui
COPY configuration.json dags/
COPY ui/dist/ui ui/dist/ui
