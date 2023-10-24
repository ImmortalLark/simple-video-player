const esbuild = require('esbuild');
const config = require('./config');

config.outfile = './lib/index.js';
esbuild.build(config);