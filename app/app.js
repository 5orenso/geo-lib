/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
    appPath = path.normalize(__dirname + '/../');

var app = require(appPath + 'lib/geo-lib');

module.exports = app;
