---
name: bump-max-year
description: Bump MAX_YEAR in the social-service-editor by +1 after a verified DB backup. Use when the user asks to "bump max year", "update the max input year", "increment MAX_YEAR", or open the yearly data-entry window for the next year. Do not run in other contexts.
---

# Bump MAX_YEAR

Yearly procedure: take a fresh DB backup, then widen the input window by one year.

## Steps

### 1. Trigger the backup workflow and wait for it to finish

```bash
gh workflow run "Backup PostgreSQL database to S3" \
  --repo OpenBudget/budgetkey-app-data-input --ref master
```

Grab the run ID and watch it:

```bash
sleep 3
RUN_ID=$(gh run list --repo OpenBudget/budgetkey-app-data-input \
  --workflow="Backup PostgreSQL database to S3" --limit 1 --json databaseId \
  --jq '.[0].databaseId')
gh run watch "$RUN_ID" --repo OpenBudget/budgetkey-app-data-input --exit-status
```

If the run fails, STOP. Report the failure to the user and do not proceed to the bump — a bump without a successful backup is what this skill exists to prevent.

### 2. Verify a new object landed in the bucket

```bash
gcloud storage ls -l gs://soproc-backups/ --project=hasadna-general \
  | sort -k2 | tail -3
```

Confirm the newest object's timestamp is from this run (not an older one). If no new object, STOP.

### 3. Bump MAX_YEAR by 1

File: `ui/src/app/social-service-editor/social-service-utils.ts`

Read the current value of the `MAX_YEAR` constant, add 1, and edit in place. Do not touch `MIN_YEAR`. Do not edit any other file.

### 4. Commit and push

```bash
git add ui/src/app/social-service-editor/social-service-utils.ts
git commit -m "Bump MAX_YEAR to <NEW_VALUE>"
git push origin master
```

Use the actual new value in the commit message (e.g. `Bump MAX_YEAR to 2025`).

## Notes

- The backup step is load-bearing — it exists so that a bad bump can be recovered by restoring. Never skip it, even if "nothing could go wrong."
- Secrets and infra for the backup live in the `OpenBudget/budgetkey-app-data-input` repo and the `hasadna-general` GCP project (bucket `gs://soproc-backups`, SA `soproc-backup-writer@hasadna-general.iam.gserviceaccount.com`).
