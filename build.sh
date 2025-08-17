#!/usr/bin/env bash
# exit on error
set -o errexit

# Build commands
rm -rf public
mkdir -p public

# Copy all files from docs to public
cp -r docs/* public/
