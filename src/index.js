'use strict';

const path = require('path');

const async = require('async');
const chalk = require('chalk');
const request = require('request');

const packagePath = path.resolve(__dirname, '../asyncjs.docset');
const resourcePath = path.resolve(packagePath, 'Contents', 'Resources');

const databasePath = path.resolve(resourcePath, 'docSet.dsidx');
const documentsPath = path.resolve(resourcePath, 'Documents');
const indexFilePath = path.resolve(documentsPath, 'index.html');

async.waterfall([
	callback => {
		console.log(chalk.green('Fetching last tag...'));
		require('./01-fetch-tag')(callback);
	},
	(tag, callback) => {
		console.log(chalk.yellow('Last tag found:', tag));
		console.log(chalk.green('Fetching README.md...'));
		require('./02-fetch-readme')(tag, (err, data) => {
			callback(err, tag, data);
		});
	},
	(tag, data, callback) => {
		console.log(chalk.green('Preprocessing data...'));
		callback(null, tag, require('./03-prepare')(data));
	},
	(tag, data, callback) => {
		console.log(chalk.green('Building AST...'));
		callback(null, tag, require('./04-ast')(data));
	},
	(tag, ast, callback) => {
		console.log(chalk.green('Parsing table of contents...'));
		callback(null, tag, ast, require('./05-toc')(ast));
	},
	(tag, ast, toc, callback) => {
		console.log(chalk.green('Building index database...'));
		require('./06-index')(databasePath, toc, (err) => {
			if (err) {
				callback(err);
				return;
			}

			callback(null, tag, ast);
		});
	},
	(tag, ast, callback) => {
		console.log(chalk.green('Preprocessing AST...'));
		callback(null, require('./07-preprocess')(tag, ast));
	},
	(ast, callback) => {
		console.log(chalk.green('Render...'));
		require('./08-render')(indexFilePath, ast, callback);
	},
	callback => {
		console.log(chalk.green('Compile js/css...'));
		require('./09-webpack')(documentsPath, callback);
	}
], (err) => {
	if (err) {
		console.error(chalk.red(err));
	} else {
		console.log(chalk.yellow('Done'));
	}
});