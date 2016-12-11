#!/bin/bash

set -e

rm -rf ./dist/**
mkdir -p ./dist/
cp -rf ./node_modules/mokit/dist/mokit.min.js ./dist/mokit.min.js
cp -rf ./node_modules/mokit/dist/mokit.js ./dist/mokit.js