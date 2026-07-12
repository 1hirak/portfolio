#!/bin/bash
echo "=== Portfolio Monitoring Report ==="
echo "Date: $(date -u)"
echo ""

echo "--- Disk Usage ---"
df -h / /data/portfolio
echo ""

echo "--- Docker Disk ---"
docker system df 2>/dev/null || echo "Docker not available"
echo ""

echo "--- Running Containers ---"
docker compose -f /data/portfolio/docker-compose.production.yml ps 2>/dev/null || echo "Compose file not found"
echo ""

echo "--- Unhealthy Containers ---"
docker ps --filter "health=unhealthy" --format "{{.Names}}" 2>/dev/null || echo "None"
echo ""

echo "--- PostgreSQL Status ---"
pg_isready -h localhost 2>/dev/null || echo "Not accessible"
echo ""

echo "--- Last Backup ---"
ls -lt /data/portfolio/backups/*.sql.gz 2>/dev/null | head -3 || echo "No local backups"
echo ""

echo "--- TLS Certificate ---"
echo | openssl s_client -connect portfolio.hirak.tech:443 -servername portfolio.hirak.tech 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "Certificate check failed"
