/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster  = require('buster'),
    assert  = buster.assert,
    path = require('path'),
    appPath = path.normalize(__dirname + '/../../'),
    libDate = require(appPath + 'lib/date'),
    date    = new libDate();

buster.testCase('lib/logger', {
    setUp: () => {
    },
    tearDown: () => {
    },
    'Date module:': {
        'isoDate wo/input': () => {
            let isoDateFormat = date.isoDate();
            assert.match(isoDateFormat, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[\+\-]\d{2}:\d{2}/);
        },
        'isoDate w/input': () => {
            let msec = Date.parse('March 21, 2012') / 1000;
            let d = new Date(msec);
            let isoDateFormat = date.isoDate(d);
            assert.match(isoDateFormat, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[\+\-]\d{2}:\d{2}/);
            assert.match(isoDateFormat, /2012-03-21T00:00:00\+\d{2}:\d{2}/);
        }
    }
});
