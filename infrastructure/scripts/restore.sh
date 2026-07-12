#!/bin/bash
set -euo pipefail

BUCKET="portfolio-hirak-tech-873461661529"
S3_PREFIX="backups/postgres"
BACKUP_DIR="/data/portfolio/backups"

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <backup-filename>"
  echo "Available backups:"
  aws s3 ls "s3://${BUCKET}/${S3_PREFIX}/" | awk '{print $4}'
  exit 1
fi

FILENAME="$1"
LOCAL_PATH="${BACKUP_DIR}/${FILENAME}"

echo "WARNING: This will restore database from: $FILENAME"
echo "         This will OVERWRITE current data."
read -rp "Are you sure? Type 'restore' to confirm: " confirmation
if [ "$confirmation" != "restore" ]; then
  echo "Cancelled."
  exit 1
fi

# Download
echo "Downloading backup..."
aws s3 cp "s3://${BUCKET}/${S3_PREFIX}/${FILENAME}" "$LOCAL_PATH"

# Validate
if [ ! -s "$LOCAL_PATH" ]; then
  echo "ERROR: Downloaded file is empty or missing"
  exit 1
fi

# Restore
echo "Restoring..."
gunzip -c "$LOCAL_PATH" | PGPASSWORD="${DATABASE_PASSWORD}" psql \
  -h localhost \
  -U "${DATABASE_USERNAME:-portfolio}" \
  -d "${DATABASE_NAME:-portfolio}"

# Clean up
rm -f "$LOCAL_PATH"
echo "Restore complete"
