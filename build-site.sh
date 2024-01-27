#!/usr/bin/env bash
pushd "$(dirname "$0")"
npx rimraf dist/*
npx rimraf dist-pg/*
npm run build
npx rimraf _site/
mkdir -p _site
cp docs _site/ -r
cp dist/index.html _site/
cp dist-pg/playground.html _site/
cp dist-pg/assets _site/ -r
popd
