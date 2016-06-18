/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
    appPath = path.normalize(__dirname + '/../');

var App = require(appPath + 'lib/my-app');
var app = new App();

module.exports = app;
