#!/bin/bash
set -euo pipefail

ENVIRONMENT="production"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H%M%SZ")
BACKUP_DIR="/data/portfolio/backups"
BUCKET="portfolio-hirak-tech-873461661529"
S3_PREFIX="backups/postgres"
FILENAME="portfolio-${ENVIRONMENT}-${TIMESTAMP}.sql.gz"
LOCAL_PATH="${BACKUP_DIR}/${FILENAME}"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "[$(date -u +"%Y-%m-%d %H:%M:%S UTC")] Starting backup: $FILENAME"

# Create backup
PGPASSWORD="${DATABASE_PASSWORD}" pg_dump \
  -h localhost \
  -U "${DATABASE_USERNAME:-portfolio}" \
  -d "${DATABASE_NAME:-portfolio}" \
  --no-owner \
  --no-acl \
  | gzip > "$LOCAL_PATH"

# Validate
if [ ! -s "$LOCAL_PATH" ]; then
  echo "ERROR: Backup file is empty"
  rm -f "$LOCAL_PATH"
  exit 1
fi

echo "Backup size: $(du -h "$LOCAL_PATH" | cut -f1)"

# Upload to S3
aws s3 cp "$LOCAL_PATH" "s3://${BUCKET}/${S3_PREFIX}/${FILENAME}" --only-show-errors
echo "Uploaded to S3: s3://${BUCKET}/${S3_PREFIX}/${FILENAME}"

# Remove local file after successful upload
rm -f "$LOCAL_PATH"

# Clean old local backups
find "$BACKUP_DIR" -name "portfolio-${ENVIRONMENT}-*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "[$(date -u +"%Y-%m-%d %H:%M:%S UTC")] Backup complete"
