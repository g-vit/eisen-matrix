#!/bin/bash
set -ex

ssh root@$DOMAIN 'cd /root/hosting && docker compose kill && docker compose rm -f'

echo Done
