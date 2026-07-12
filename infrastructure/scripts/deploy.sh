#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/../.."
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REVISION=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

echo "=== Deploying portfolio @ $REVISION ($TIMESTAMP) ==="

cd "$PROJECT_DIR"

# Check required vars
required_vars=(
  "DATABASE_PASSWORD" "APP_KEYS" "API_TOKEN_SALT" "ADMIN_JWT_SECRET"
  "TRANSFER_TOKEN_SALT" "STRAPI_API_TOKEN" "PREVIEW_SECRET" "REVALIDATION_SECRET"
)
missing=0
for var in "${required_vars[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "ERROR: $var is not set"
    missing=1
  fi
done
[ "$missing" -eq 1 ] && exit 1

# Pull latest
if [ -d .git ]; then
  git pull --ff-only origin main || echo "Warning: git pull failed, continuing with local code"
fi

# Stop any non-Docker process on port 1337 (legacy host Strapi)
echo "Freeing port 1337..."
PORT_PID=$(sudo lsof -ti :1337 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
  echo "Killing PID $PORT_PID on port 1337"
  sudo kill "$PORT_PID" 2>/dev/null || true
  sleep 3
fi

# Build and start
echo "Building and starting containers..."
docker compose -f docker-compose.production.yml build --pull
docker compose -f docker-compose.production.yml up -d

# Wait for health checks
echo "Waiting for health checks..."
for service in postgres cms web; do
  echo "Waiting for $service..."
  for i in $(seq 1 30); do
    status=$(docker compose -f docker-compose.production.yml ps --format json "$service" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('Health',''))" 2>/dev/null || echo "")
    if [ "$status" = "healthy" ]; then
      echo "$service is healthy"
      break
    fi
    sleep 2
  done
done

# Test endpoints
echo "Testing endpoints..."
curl -sf http://localhost:3000/api/health > /dev/null && echo "Health endpoint OK" || echo "Health endpoint FAILED"
curl -sf http://localhost:1337/_health > /dev/null && echo "CMS health endpoint OK" || echo "CMS health endpoint FAILED"

# Cleanup
docker image prune -f

echo "=== Deploy complete: $REVISION ==="
