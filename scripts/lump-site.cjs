#!/usr/bin/env node
//
// Lump together the whole garfunkel site
//

const { rimraf } = require('rimraf');
const { mkdirSync, cpSync } = require('fs');
const { resolve } = require('path');
const { execSync } = require('child_process');

process.chdir(resolve(__dirname, '..'));

(async () => {
	// Ensure folders
	console.log('Ensure ./dist/');
	await rimraf('./dist/');
	mkdirSync('dist');

	console.log('Ensure ./coverage/');
	await rimraf('./coverage/');
	mkdirSync('coverage');

	console.log('Ensure ./dist-pg/');
	await rimraf('./dist-pg/');
	mkdirSync('dist-pg');

	console.log('Ensure ./dist-test/');
	await rimraf('./dist-test/');
	mkdirSync('dist-test');

	console.log('Ensure ./_site/');
	await rimraf('./_site/');
	mkdirSync('_site');

	// Build
	execSync('npm run build', { stdio: 'inherit' });

	// Copy together
	cpSync('dist/index.html', '_site/index.html');
	cpSync('dist-pg/playground.html', '_site/playground.html');
	cpSync('dist-test', '_site/test-report', {recursive: true});
	cpSync('coverage', '_site/coverage', {recursive: true});
	cpSync('docs', '_site/docs', { recursive: true });
	cpSync('dist-pg/assets', '_site/assets', { recursive: true });
})();

// pushd "$(dirname "$0")"
// npx rimraf dist/*
// npx rimraf dist-pg/*
// npm run build
// npx rimraf _site/
// mkdir -p _site
// cp docs _site/ -r
// cp dist/index.html _site/
// cp dist-pg/playground.html _site/
// cp dist-pg/assets _site/ -r
// popd
