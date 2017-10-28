#!/usr/bin/env node
'use strict';

const simpleCommandline = require('../lib/simplecommandline.js');

let filename = __filename.replace(__dirname, '');

simpleCommandline.init(filename, __filename.replace('/bin'+filename, ''));