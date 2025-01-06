#!/bin/bash
set -e

echo "Compiling js..."
rm -r -f dist
tsc 

echo "Moving assets.."

mkdir dist/assets
cp -r assets/db dist/assets/db

echo "App is ready!"