/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

let buster = require('buster'),
    assert = buster.assert,
    path = require('path'),
    appPath = path.normalize(__dirname + '/../../');

buster.testCase('lib/geo-lib', {
    setUp: () => {
    },
    tearDown: () => {
        delete require.cache[require.resolve(appPath + 'lib/geo-lib')];
    },
    'Calculate distance': {
        'with haversine': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance({
                p1: { lat: 70.3369224, lon: 30.3411273 },
                p2: { lat: 59.8939528, lon: 10.6450348 }
            });
            assert.equals(result, {
                distance: 1468.28,
                unit: 'km',
                method: 'haversine'
            });
        },

        'with vincenty': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance({
                p1: { lat: 70.3369224, lon: 30.3411273 },
                p2: { lat: 59.8939528, lon: 10.6450348 },
                method: 'vincenty'
            });
            assert.equals(result, {
                distance: 1472.86,
                unit: 'km',
                method: 'vincenty'
            });
        },

        'with haversine and with seconds between points': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance({
                p1: { lat: 70.3369224, lon: 30.3411273 },
                p2: { lat: 59.8939528, lon: 10.6450348 },
                timeUsed: 86400 * 5
            });
            assert.equals(result, {
                distance: 1468.28,
                method: 'haversine',
                speedKph: 12.24,
                speedMph: 7.61,
                speedMpk: '5:54',
                timeUsedInSeconds: 432000,
                unit: 'km'
            });
        }

    }
});
