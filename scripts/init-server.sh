#!/bin/bash
set -ex

# Prepare
ssh root@$DOMAIN apt update
ssh root@$DOMAIN apt install -y net-tools nmap apache2-utils
ssh root@$DOMAIN mkdir -p /root/hosting
ssh root@$DOMAIN mkdir -p /opt/traefik/letsencrypt
ssh root@$DOMAIN mkdir -p /opt/eisen

## Install Docker
ssh root@$DOMAIN DEBIAN_FRONTEND=noninteractive apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
ssh root@$DOMAIN 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -'
ssh root@$DOMAIN 'add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"'
ssh root@$DOMAIN apt update
ssh root@$DOMAIN apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

## Set 4GB Swap
ssh root@$DOMAIN swapoff -a
ssh root@$DOMAIN fallocate -l 4G /swapfile
ssh root@$DOMAIN dd if=/dev/zero of=/swapfile bs=1024 count=4194304
ssh root@$DOMAIN chmod 600 /swapfile
ssh root@$DOMAIN mkswap /swapfile
ssh root@$DOMAIN swapon /swapfile
ssh root@$DOMAIN /bin/bash <<EOF
  set -e
  if grep -q '^\/swapfile' /etc/fstab; then
    echo "swapfile is setted"
  else 
    echo "set swapfile"
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
EOF

## Crons
ssh root@$DOMAIN "echo '@reboot cd /root/hosting && docker compose up -d --remove-orphans' | crontab -"

## Done
echo Done
