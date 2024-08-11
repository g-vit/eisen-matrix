#!/bin/bash
set -e

if [ -z "$LOGIN" ]; then
  echo "You need to set LOGIN in the .env file or export the variable separately."
  exit 1
fi

if [ -z "$PASS" ]; then
  echo "You need to set PASS in the .env file or export the variable separately."
  exit 1
fi

rsync -azvP --del \
  --exclude '.git' \
  --exclude 'ui/node_modules' \
  --exclude 'bin' \
  --exclude 'scripts' \
  . root@$HOST:/root/hosting/

ssh root@$HOST "htpasswd -nbB $LOGIN $PASS > /opt/traefik/htpasswd"
ssh root@$HOST 'cd /root/hosting && docker compose kill && docker compose rm -f'
ssh root@$HOST 'cd /root/hosting && docker compose build'
ssh root@$HOST 'cd /root/hosting && docker compose up --remove-orphans -d'

echo Done
