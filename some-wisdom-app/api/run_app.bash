#!/bin/bash
set -e
export DB_PATH="${PWD}/dist/assets/db"
exec node dist/app.js