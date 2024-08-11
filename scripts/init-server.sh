#!/bin/bash
set -ex

# Prepare
ssh root@$HOST apt update
ssh root@$HOST apt install -y net-tools nmap
ssh root@$HOST mkdir -p /root/hosting
ssh root@$HOST mkdir -p /opt/traefik/letsencrypt
ssh root@$HOST mkdir -p /opt/eisen
ssh root@$HOST touch /opt/eisen/data.json

## Install Docker
ssh root@$HOST DEBIAN_FRONTEND=noninteractive apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
ssh root@$HOST 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -'
ssh root@$HOST 'add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"'
ssh root@$HOST apt update
ssh root@$HOST apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

## Set 4GB Swap
ssh root@$HOST swapoff -a
ssh root@$HOST fallocate -l 4G /swapfile
ssh root@$HOST dd if=/dev/zero of=/swapfile bs=1024 count=4194304
ssh root@$HOST chmod 600 /swapfile
ssh root@$HOST mkswap /swapfile
ssh root@$HOST swapon /swapfile
ssh root@$HOST /bin/bash <<EOF
  set -e
  if grep -q '^\/swapfile' /etc/fstab; then
    echo "swapfile is setted"
  else 
    echo "set swapfile"
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
EOF

## Crons
ssh root@$HOST "echo '@reboot cd /root/hosting && docker compose up -d --remove-orphans' | crontab -"

## Done
echo Done
