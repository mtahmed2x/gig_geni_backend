#!/bin/bash
echo "Starting production environment..."

node dist/server.js &
node dist/workers/competitionWorker.js &

echo "All processes started."