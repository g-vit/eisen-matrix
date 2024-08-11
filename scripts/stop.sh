#!/bin/bash
set -ex

ssh root@$HOST 'cd /root/hosting && docker compose kill && docker compose rm -f'

echo Done
