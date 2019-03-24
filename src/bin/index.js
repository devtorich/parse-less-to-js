#!/usr/bin/env node
const parse = require('../index.js').parse
const fs = require('fs');
const path = require('path');
const argv = require('optimist').argv;

parse(argv);
