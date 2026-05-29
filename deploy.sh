#!/bin/bash
# VR.org manual deploy (Docker).
#
# The normal deploy path is the GitHub webhook listener, which runs these same
# steps automatically on every push to master. This script is a manual fallback
# only. The app runs in Docker via docker-compose, NOT PM2. PM2 manages only the
# deploy-hook listener, never a "vr-org" process. Do not reintroduce PM2 here.

set -e

echo "=== VR.org Deployment (Docker) ==="

cd "$(dirname "$0")"

echo "Syncing to origin/master..."
git fetch origin master
git reset --hard origin/master

echo "Rebuilding and restarting the container..."
docker compose up -d --build

echo ""
echo "=== Deploy complete ==="
docker ps --filter "name=vr-org"
