#!/bin/bash
set -ex

rsync -azvP --del \
  --exclude '.git' \
  --exclude 'ui/node_modules' \
  --exclude 'bin' \
  --exclude 'scripts' \
  . root@$HOST:/root/hosting/

ssh root@$HOST 'cd /root/hosting && docker compose kill && docker compose rm -f'
ssh root@$HOST 'cd /root/hosting && docker compose build'
ssh root@$HOST 'cd /root/hosting && docker compose up server --remove-orphans -d'

echo Done
