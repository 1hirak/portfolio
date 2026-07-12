#!/bin/bash
set -euo pipefail

echo "=== Setting up Let's Encrypt Certificates ==="
echo "Domains: portfolio.hirak.tech, cms.portfolio.hirak.tech, api.portfolio.hirak.tech"
echo ""
echo "Prerequisites:"
echo "  1. DNS A records point to this server's IP"
echo "  2. Port 80 is publicly accessible"
echo "  3. Nginx is installed"
echo ""

read -rp "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
  echo "Cancelled."
  exit 1
fi

# Install certbot if needed
if ! command -v certbot &> /dev/null; then
  sudo apt-get update
  sudo apt-get install -y certbot python3-certbot-nginx
fi

# Create certificate
sudo certbot --nginx \
  -d portfolio.hirak.tech \
  -d cms.portfolio.hirak.tech \
  -d api.portfolio.hirak.tech \
  --non-interactive \
  --agree-tos \
  --email admin@hirak.tech

# Verify renewal
sudo certbot renew --dry-run

echo ""
echo "Certificate setup complete."
echo "Auto-renewal is configured via systemd timer."
