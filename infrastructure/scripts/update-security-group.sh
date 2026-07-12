#!/bin/bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <new-admin-ip>"
  echo "Example: $0 203.0.113.42"
  exit 1
fi

NEW_IP="$1"
GROUP_ID="sg-0a0526f1c7769e3a7"

# Get current SSH rule ID
OLD_RULE_ID=$(aws ec2 describe-security-group-rules \
  --filters "Name=group-id,Values=$GROUP_ID" "Name=protocol,Values=tcp" "Name=from-port,Values=22" \
  --query "SecurityGroupRules[?CidrIpv4!='0.0.0.0/0'].SecurityGroupRuleId" \
  --output text)

if [ -n "$OLD_RULE_ID" ]; then
  aws ec2 revoke-security-group-ingress --group-id "$GROUP_ID" --security-group-rule-ids "$OLD_RULE_ID"
fi

aws ec2 authorize-security-group-ingress \
  --group-id "$GROUP_ID" \
  --protocol tcp \
  --port 22 \
  --cidr "${NEW_IP}/32"

echo "SSH access updated to ${NEW_IP}/32"
